const fetch = require('node-fetch');

async function fixEncryption() {
  console.log('Calling fixPaddleEncryption function...\n');
  
  try {
    // Replace with your own Firebase project URL
    const response = await fetch('https://us-central1-your-project-id.cloudfunctions.net/fixPaddleEncryption', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });
    
    const result = await response.json();
    console.log('Response:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
}

fixEncryption();
