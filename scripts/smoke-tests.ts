#!/usr/bin/env tsx

const BASE_URL = 'http://localhost:5000';

async function apiRequest(method: string, path: string, body?: any) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`${method} ${path} failed with ${response.status}: ${errorText}`);
  }

  return response.json();
}

async function smokeTests() {
  console.log('💨 Running comprehensive EPM smoke tests...');
  
  try {
    // Basic server connectivity
    console.log('\n1️⃣ Testing basic server connectivity...');
    const response = await fetch(`${BASE_URL}/api`);
    if (response.ok) {
      console.log('✅ API server is responding');
    } else {
      throw new Error(`API server returned ${response.status}`);
    }

    // Test EPM project stages API
    console.log('\n2️⃣ Testing EPM project stages...');
    const stages = await apiRequest('GET', '/api/projects/demo-proj-001/stages');
    console.log(`✅ Retrieved ${stages.length} project stages`);
    
    if (stages.length !== 3) {
      throw new Error(`Expected 3 stages, got ${stages.length}`);
    }

    const expectedStageOrder = ['Preparation & Setup', 'Hull Blasting Operations', 'Coating Application'];
    const actualStageNames = stages.map((s: any) => s.name);
    
    expectedStageOrder.forEach((expectedName, index) => {
      if (actualStageNames[index] !== expectedName) {
        throw new Error(`Stage ${index + 1}: expected "${expectedName}", got "${actualStageNames[index]}"`);
      }
    });
    console.log('✅ Stage order and names correct');

    // Test checklist template API
    console.log('\n3️⃣ Testing checklist template...');
    const templates = await apiRequest('GET', '/api/checklist-templates');
    console.log(`✅ Retrieved ${templates.length} checklist templates`);
    
    const hullBlastTemplate = templates.find((t: any) => t.name === 'Hull Blast Inspection Checklist');
    if (!hullBlastTemplate) {
      throw new Error('Hull Blast Inspection Checklist template not found');
    }

    const templateItems = hullBlastTemplate.items || [];
    const requiredItems = templateItems.filter((item: any) => item.required);
    const optionalItems = templateItems.filter((item: any) => !item.required);
    
    if (requiredItems.length !== 5) {
      throw new Error(`Expected 5 required items, got ${requiredItems.length}`);
    }
    if (optionalItems.length !== 3) {
      throw new Error(`Expected 3 optional items, got ${optionalItems.length}`);
    }
    console.log('✅ Template has correct required (5) and optional (3) items');

    // Test checklist instantiation
    console.log('\n4️⃣ Testing checklist instantiation...');
    const checklist = await apiRequest('POST', '/api/projects/demo-proj-001/checklists', {
      templateId: hullBlastTemplate.id,
      stageId: stages[0].id // Associate with first stage
    });
    
    if (!checklist.id) {
      throw new Error('Checklist was not created properly');
    }

    const checklistDetails = await apiRequest('GET', `/api/checklists/${checklist.id}`);
    if (checklistDetails.requiredItems.length !== 5) {
      throw new Error(`Expected 5 required checklist items, got ${checklistDetails.requiredItems.length}`);
    }
    if (checklistDetails.optionalItems.length !== 3) {
      throw new Error(`Expected 3 optional checklist items, got ${checklistDetails.optionalItems.length}`);
    }
    console.log('✅ Checklist instantiation created correct number of items');

    // Test progress calculation (should be 0% initially)
    console.log('\n5️⃣ Testing progress calculation...');
    const initialProgress = await apiRequest('GET', '/api/projects/demo-proj-001/progress');
    
    if (initialProgress.overallPercentage !== 0) {
      throw new Error(`Expected 0% initial progress, got ${initialProgress.overallPercentage}%`);
    }

    const stage1Progress = initialProgress.stages.find((s: any) => s.stageId === stages[0].id);
    if (stage1Progress.percentage !== 0) {
      throw new Error(`Expected 0% stage progress, got ${stage1Progress.percentage}%`);
    }
    console.log('✅ Initial progress calculation correct (0%)');

    // Test checklist item updates 
    console.log('\n6️⃣ Testing checklist item updates...');
    const firstRequiredItem = checklistDetails.requiredItems[0];
    
    // Complete first required item
    const updatedItem = await apiRequest('PATCH', `/api/checklist-items/${firstRequiredItem.id}`, {
      status: 'complete',
      value: true
    });
    
    if (updatedItem.status !== 'complete') {
      throw new Error('Checklist item was not marked as complete');
    }
    if (!updatedItem.completedAt) {
      throw new Error('Checklist item completedAt timestamp not set');
    }
    console.log('✅ Checklist item can be completed');

    // Test progress calculation after partial completion
    console.log('\n7️⃣ Testing progress after partial completion...');
    const partialProgress = await apiRequest('GET', '/api/projects/demo-proj-001/progress');
    const updatedStage1Progress = partialProgress.stages.find((s: any) => s.stageId === stages[0].id);
    
    const expectedProgress = Math.round((1 / 5) * 100); // 1 of 5 required items complete
    if (updatedStage1Progress.percentage !== expectedProgress) {
      throw new Error(`Expected ${expectedProgress}% stage progress, got ${updatedStage1Progress.percentage}%`);
    }
    console.log(`✅ Progress calculation correct after partial completion (${expectedProgress}%)`);

    // Test approval failure when not all required items complete
    console.log('\n8️⃣ Testing approval failure with incomplete requirements...');
    try {
      await apiRequest('POST', `/api/projects/demo-proj-001/stages/${stages[0].id}/approve`, {
        status: 'approved',
        note: 'Should fail - not all required items complete'
      });
      throw new Error('Approval should have failed with incomplete required items');
    } catch (error: any) {
      if (error.message.includes('required checklist items are not complete')) {
        console.log('✅ Approval correctly rejected for incomplete requirements');
      } else {
        throw error;
      }
    }

    // Complete all remaining required items
    console.log('\n9️⃣ Completing remaining required items...');
    const remainingRequiredItems = checklistDetails.requiredItems.slice(1);
    
    for (const item of remainingRequiredItems) {
      let value: any = true; // Default boolean value
      
      // Set appropriate values based on item type
      if (item.type === 'number') {
        // Set valid values within validation ranges
        if (item.label.includes('temperature')) {
          value = 75; // Valid temperature
        } else if (item.label.includes('humidity')) {
          value = 60; // Valid humidity
        } else {
          value = 50; // Default number
        }
      } else if (item.type === 'signature') {
        value = 'John Supervisor'; // Signature value
      }

      await apiRequest('PATCH', `/api/checklist-items/${item.id}`, {
        status: 'complete',
        value: value
      });
    }
    console.log('✅ All required items completed');

    // Test progress calculation at 100%
    console.log('\n🔟 Testing 100% progress calculation...');
    const completeProgress = await apiRequest('GET', '/api/projects/demo-proj-001/progress');
    const completeStage1Progress = completeProgress.stages.find((s: any) => s.stageId === stages[0].id);
    
    if (completeStage1Progress.percentage !== 100) {
      throw new Error(`Expected 100% stage progress, got ${completeStage1Progress.percentage}%`);
    }
    console.log('✅ Progress calculation correct at completion (100%)');

    // Test successful approval when all required items complete
    console.log('\n1️⃣1️⃣ Testing successful stage approval...');
    const approvalResult = await apiRequest('POST', `/api/projects/demo-proj-001/stages/${stages[0].id}/approve`, {
      status: 'approved',
      note: 'All requirements met - approved for next stage'
    });
    
    if (!approvalResult.success) {
      throw new Error('Stage approval should have succeeded');
    }
    console.log('✅ Stage approval succeeded with complete requirements');

    // Verify approval status in stages list
    console.log('\n1️⃣2️⃣ Verifying approval status...');
    const finalStages = await apiRequest('GET', '/api/projects/demo-proj-001/stages');
    const approvedStage = finalStages.find((s: any) => s.id === stages[0].id);
    
    if (approvedStage.approvalStatus !== 'approved') {
      throw new Error(`Expected approved status, got ${approvedStage.approvalStatus}`);
    }
    console.log('✅ Stage approval status correctly reflected');

    // Test overall project progress
    console.log('\n1️⃣3️⃣ Testing overall project progress...');
    const finalProgress = await apiRequest('GET', '/api/projects/demo-proj-001/progress');
    
    // With one stage 100% complete out of 3 stages, overall should be ~33%
    const expectedOverallProgress = Math.round((100 / 3)); // ~33%
    if (Math.abs(finalProgress.overallPercentage - expectedOverallProgress) > 1) {
      throw new Error(`Expected ~${expectedOverallProgress}% overall progress, got ${finalProgress.overallPercentage}%`);
    }
    console.log(`✅ Overall project progress correct (~${finalProgress.overallPercentage}%)`);

    console.log('\n🎉 All EPM smoke tests passed!');
    console.log('💨 Smoke tests completed successfully');
    
    // Summary
    console.log('\n📊 Test Summary:');
    console.log('   ✅ Server connectivity');
    console.log('   ✅ Project stages API');
    console.log('   ✅ Checklist template with correct items (5 req + 3 opt)');
    console.log('   ✅ Checklist instantiation');
    console.log('   ✅ Progress calculation (0% → 20% → 100%)');
    console.log('   ✅ Approval blocking on incomplete requirements');
    console.log('   ✅ Approval success with complete requirements');
    console.log('   ✅ Overall project progress tracking');
    
  } catch (error) {
    console.error('❌ Smoke tests failed:', error);
    process.exit(1);
  }
}

smokeTests();