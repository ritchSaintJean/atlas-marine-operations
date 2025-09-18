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

  const result = {
    status: response.status,
    ok: response.ok,
    data: null as any,
  };
  
  try {
    result.data = await response.json();
  } catch {
    result.data = await response.text();
  }

  return result;
}

async function debugAuth() {
  console.log('🔍 Debug: Testing user registration and login...');
  
  const testUser = {
    username: 'debug-user',
    password: 'debug123',
    firstName: 'Debug',
    lastName: 'User',
    role: 'tech',
    email: 'debug@test.com'
  };
  
  // Step 1: Register user
  console.log('1. Registering user...');
  const registerResult = await apiRequest('POST', '/api/auth/register', testUser);
  console.log('Register result:', JSON.stringify(registerResult, null, 2));
  
  if (!registerResult.ok) {
    console.error('❌ Registration failed');
    return;
  }
  
  // Step 2: Wait a moment
  console.log('2. Waiting 1 second...');
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Step 3: Try to login
  console.log('3. Attempting login...');
  const loginResult = await apiRequest('POST', '/api/auth/login', {
    username: testUser.username,
    password: testUser.password
  });
  console.log('Login result:', JSON.stringify(loginResult, null, 2));
  
  if (loginResult.ok) {
    console.log('✅ Login successful!');
  } else {
    console.log('❌ Login failed');
    
    // Step 4: Check if user exists
    console.log('4. Checking if user exists in system...');
    try {
      // Try to register the same user again to see what happens
      const dupRegisterResult = await apiRequest('POST', '/api/auth/register', testUser);
      console.log('Duplicate registration result:', JSON.stringify(dupRegisterResult, null, 2));
      
      if (dupRegisterResult.status === 400 && dupRegisterResult.data.error === 'Username already exists') {
        console.log('✅ User exists in system, but login is failing');
      }
    } catch (error) {
      console.log('Error checking user existence:', error);
    }
  }
}

debugAuth().catch(console.error);