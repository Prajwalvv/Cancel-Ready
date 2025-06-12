const { createClient } = require('@supabase/supabase-js');
// Load environment variables
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://your-project-id.supabase.co',
  process.env.SUPABASE_SERVICE_KEY || 'your_supabase_service_key'
);

async function checkVendorData() {
  console.log('Checking vendor data and encryption status...\n');
  
  // Get all vendors
  const { data: vendors, error } = await supabase
    .from('companies')
    .select('*');
    
  if (error) {
    console.error('Error fetching vendors:', error);
    return;
  }
  
  console.log(`Found ${vendors.length} vendors\n`);
  
  for (const vendor of vendors) {
    console.log(`Vendor: ${vendor.company_name}`);
    console.log(`- Vendor Key: ${vendor.vendor_key}`);
    console.log(`- Payment Processor: ${vendor.payment_processor}`);
    
    if (vendor.payment_processor === 'stripe') {
      console.log(`- Stripe API Key: ${vendor.stripe_api_key ? 'SET' : 'NOT SET'}`);
      if (vendor.stripe_api_key) {
        console.log(`  - Type: ${typeof vendor.stripe_api_key}`);
        console.log(`  - Is Object: ${typeof vendor.stripe_api_key === 'object'}`);
        if (typeof vendor.stripe_api_key === 'object') {
          console.log(`  - Has required fields: iv=${!!vendor.stripe_api_key.iv}, tag=${!!vendor.stripe_api_key.tag}, encryptedData=${!!vendor.stripe_api_key.encryptedData}`);
        } else {
          console.log(`  - Value (first 20 chars): ${JSON.stringify(vendor.stripe_api_key).substring(0, 20)}...`);
        }
      }
    }
    
    if (vendor.payment_processor === 'paddle') {
      console.log(`- Paddle Vendor ID: ${vendor.paddle_vendor_id || 'NOT SET'}`);
      console.log(`- Paddle API Key: ${vendor.paddle_api_key ? 'SET' : 'NOT SET'}`);
      if (vendor.paddle_api_key) {
        console.log(`  - Type: ${typeof vendor.paddle_api_key}`);
        console.log(`  - Is Object: ${typeof vendor.paddle_api_key === 'object'}`);
        if (typeof vendor.paddle_api_key === 'object') {
          console.log(`  - Has required fields: iv=${!!vendor.paddle_api_key.iv}, tag=${!!vendor.paddle_api_key.tag}, encryptedData=${!!vendor.paddle_api_key.encryptedData}`);
        } else {
          console.log(`  - Value (first 20 chars): ${JSON.stringify(vendor.paddle_api_key).substring(0, 20)}...`);
        }
      }
    }
    
    console.log('---\n');
  }
}

checkVendorData().catch(console.error);
