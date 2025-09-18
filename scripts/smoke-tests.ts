#!/usr/bin/env tsx

async function smokeTests() {
  console.log('💨 Running smoke tests...');
  
  try {
    // Basic smoke test - check if server can start
    const response = await fetch('http://localhost:5000/api');
    if (response.ok) {
      console.log('✅ API server is responding');
    } else {
      throw new Error(`API server returned ${response.status}`);
    }
    
    console.log('💨 Smoke tests passed');
  } catch (error) {
    console.error('❌ Smoke tests failed:', error);
    process.exit(1);
  }
}

smokeTests();