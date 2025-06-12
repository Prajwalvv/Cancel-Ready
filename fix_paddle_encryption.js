const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

// Load environment variables
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://your-project-id.supabase.co',
  process.env.SUPABASE_SERVICE_KEY || 'your_supabase_service_key'
);

const ENC_SECRET = process.env.ENCRYPTION_SECRET || 'YOUR_ENCRYPTION_SECRET_HERE';

const pad32 = key => {
  const buf = Buffer.from(key, 'utf8');
  if (buf.length >= 32) return buf.subarray(0, 32);
  const padded = Buffer.alloc(32);
  buf.copy(padded);
  return padded;
};

const encrypt = text => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', pad32(ENC_SECRET), iv);
  let enc = cipher.update(text, 'utf8', 'hex');
  enc += cipher.final('hex');
  const tag = cipher.getAuthTag();
  return { iv: iv.toString('hex'), encryptedData: enc, tag: tag.toString('hex') };
};

async function fixPaddleEncryption() {
  console.log('Checking for vendors with unencrypted Paddle API keys...\n');
  
  // Get all vendors with paddle payment processor
  const { data: vendors, error } = await supabase
    .from('companies')
    .select('*')
    .eq('payment_processor', 'paddle');
    
  if (error) {
    console.error('Error fetching vendors:', error);
    return;
  }
  
  console.log(`Found ${vendors.length} Paddle vendors\n`);
  
  for (const vendor of vendors) {
    console.log(`Checking vendor: ${vendor.company_name}`);
    
    if (vendor.paddle_api_key && typeof vendor.paddle_api_key === 'string') {
      console.log(`  - Found unencrypted Paddle API key: ${vendor.paddle_api_key.substring(0, 10)}...`);
      console.log(`  - Encrypting API key...`);
      
      // Encrypt the API key
      const encryptedKey = encrypt(vendor.paddle_api_key);
      
      // Update the vendor record
      const { error: updateError } = await supabase
        .from('companies')
        .update({ paddle_api_key: encryptedKey })
        .eq('vendor_key', vendor.vendor_key);
        
      if (updateError) {
        console.error(`  - Error updating vendor: ${updateError.message}`);
      } else {
        console.log(`  - Successfully encrypted and updated Paddle API key`);
      }
    } else if (vendor.paddle_api_key && typeof vendor.paddle_api_key === 'object') {
      console.log(`  - Paddle API key is already encrypted`);
    } else {
      console.log(`  - No Paddle API key found`);
    }
    
    console.log('---\n');
  }
  
  console.log('Done!');
}

fixPaddleEncryption().catch(console.error);
