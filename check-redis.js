require('dotenv').config({ path: '.env.local' });
const { Redis } = require('@upstash/redis');

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

async function checkRedisData() {
  try {
    console.log('Checking Redis data...');
    console.log('URL:', process.env.KV_REST_API_URL);
    console.log('Token length:', process.env.KV_REST_API_TOKEN ? process.env.KV_REST_API_TOKEN.length : 0);
    
    const efficientData = await redis.get('piStore:efficient');
    console.log('\npiStore:efficient =', JSON.stringify(efficientData, null, 2));
    
    const optimizedData = await redis.get('piStore:optimized');
    console.log('\npiStore:optimized =', JSON.stringify(optimizedData, null, 2));
  } catch (err) {
    console.error('Error:', err);
  }
}

checkRedisData();
