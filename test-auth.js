// Simple script to test authentication with production settings
// Using built-in fetch API (Node.js 18+)

// Important: Set TEST_AUTH environment variable
process.env.TEST_AUTH = 'true';

// Replace with your actual keys from .env.local
const API_SECRET_KEY = process.env.API_SECRET_KEY || '7388ec203b402efb550d12192109c38a0c9a5fc3d873ffca912bc66ef63f0e5bee8b5e2a8368c35dade3bc9027418cff2819e75d8402d5fe3f783d19ca6cf687';
const PUBLIC_API_KEY = process.env.PUBLIC_API_SECRET_KEY || '433701ff88a57bfb32f4fbbc1bad7ddfab06dcbd7660fcf89422f4a27e7ae2a4189e298b43e2ccce1818cead87b8bc4766b213a523b5ca69be3a6d8476954e6a';

console.log('Keys being used:');
console.log('API_SECRET_KEY length:', API_SECRET_KEY.length);
console.log('PUBLIC_API_KEY length:', PUBLIC_API_KEY.length);

// Test both keys
async function testAuth() {
  console.log('Testing authentication with production settings...');
  console.log('---------------------------------------------------');

  // Test with no auth header
  console.log('\n1. Testing with NO auth header:');
  await testRequest('http://localhost:3000/api/circumference?mode=optimized&increment=true');
  
  // Test with server key
  console.log('\n2. Testing with SERVER key:');
  await testRequest(
    'http://localhost:3000/api/circumference?mode=optimized&increment=true', 
    `Bearer ${API_SECRET_KEY}`
  );
  
  // Test with public key
  console.log('\n3. Testing with PUBLIC key:');
  await testRequest(
    'http://localhost:3000/api/circumference?mode=optimized&increment=true', 
    `Bearer ${PUBLIC_API_KEY}`
  );
}

async function testRequest(url, authHeader = null) {
  try {
    // Add headers that simulate a browser request
    const headers = {
      'Referer': 'http://localhost:3000/',
      'Origin': 'http://localhost:3000',
      'Host': 'localhost:3000'
    };
    
    if (authHeader) {
      headers.Authorization = authHeader;
    }
    
    console.log(`Requesting: ${url}`);
    console.log(`Auth header: ${authHeader ? 'Present' : 'None'}`);
    
    const response = await fetch(url, { headers });
    const status = response.status;
    
    console.log(`Status: ${status} (${response.statusText})`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Success! Response data:', data);
    } else {
      try {
        const errorData = await response.json();
        console.log('Error response:', errorData);
      } catch (e) {
        const text = await response.text();
        console.log('Error text:', text);
      }
    }
  } catch (error) {
    console.error('Request failed:', error.message);
  }
}

testAuth();
