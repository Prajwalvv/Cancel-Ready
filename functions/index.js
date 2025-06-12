const functions = require('firebase-functions');
const admin = require('firebase-admin');
const crypto = require('crypto');
const fetch = require('node-fetch');
const stripe = require('stripe'); // For Stripe API interaction

// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();

// Encryption configuration
const ENC_SECRET = process.env.ENCRYPTION_SECRET || 'YOUR_ENCRYPTION_SECRET_HERE';

// Utility functions
const pad32 = (key) => {
  const buf = Buffer.from(key, 'utf8');
  if (buf.length >= 32) return buf.subarray(0, 32);
  const padded = Buffer.alloc(32);
  buf.copy(padded);
  return padded;
};

const encrypt = (text) => {
  if (!text) return null;
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', pad32(ENC_SECRET), iv);
  let enc = cipher.update(text, 'utf8', 'hex');
  enc += cipher.final('hex');
  const tag = cipher.getAuthTag();
  return { 
    iv: iv.toString('hex'), 
    encryptedData: enc, 
    tag: tag.toString('hex') 
  };
};

const decrypt = (obj) => {
  if (!obj) return null;
  const d = crypto.createDecipheriv('aes-256-gcm', pad32(ENC_SECRET), Buffer.from(obj.iv, 'hex'));
  d.setAuthTag(Buffer.from(obj.tag, 'hex'));
  let dec = d.update(obj.encryptedData, 'hex', 'utf8');
  dec += d.final('utf8');
  return dec;
};

const generateId = () => crypto.randomBytes(16).toString('hex');

// Note: The registerVendor function has been removed as vendor registration is now handled directly in the client
// using Firebase Authentication and Firestore

// ---------- cancelHandler --------------------------------------------------
exports.cancelHandler = functions.https.onRequest(async (req, res) => {
  res.set({ 
    'Access-Control-Allow-Origin': '*', 
    'Access-Control-Allow-Methods': 'POST,OPTIONS', 
    'Access-Control-Allow-Headers': '*' 
  });
  
  if (req.method === 'OPTIONS') return res.status(204).send();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  try {
    const { vendorKey, userId, email, reason, feedback } = req.body || {};
    if (!vendorKey || !userId) {
      return res.status(400).json({ error: 'vendorKey & userId required' });
    }

    // Get vendor from Firestore
    const vendorDoc = await db.collection('vendors').doc(vendorKey).get();
    if (!vendorDoc.exists) {
      return res.status(403).json({ error: 'Invalid vendorKey' });
    }

    const vendor = vendorDoc.data();
    console.log('Processing cancellation for:', vendor.companyName || vendor.company_name);
    
    // Prepare cancellation record
    const cancellationData = {
      vendorKey: vendorKey,
      userId: userId,
      email: email || 'Not provided',
      reason: reason || 'Not specified',
      feedback: feedback || '',
      time: admin.firestore.FieldValue.serverTimestamp(),
      status: 'pending'
    };
    
    // Determine processor type
    const processor = vendor.processor || vendor.payment_processor;
    
    if (processor === 'stripe') {
      // Handle Stripe cancellation
      const stripeKeyField = vendor.stripeKey || vendor.stripe_api_key;
      if (!stripeKeyField) {
        return res.status(400).json({ error: 'Stripe API key not configured' });
      }

      const stripeKey = stripeKeyField; // DEBUG: Using plaintext Stripe key
      // The check for !stripeKey (after decryption) is now implicitly covered by checking !stripeKeyField earlier if it's null/undefined.
      // If stripeKeyField was an empty string, stripeKey would also be empty. This check remains somewhat relevant.
      if (!stripeKey) {
        console.error('Failed to decrypt Stripe key for vendor:', vendorKey);
        cancellationData.status = 'failed';
        cancellationData.processor = 'stripe';
        cancellationData.error = 'Failed to decrypt Stripe API key.';
        const cancelRef = await db.collection('cancels').add(cancellationData);
        return res.status(500).json({ error: 'Internal server error - key access failed', cancellationId: cancelRef.id });
      }

      const stripeClient = stripe(stripeKey);
      
      try {
        console.log(`Attempting Stripe subscription cancellation for ID: ${userId}`);
        // Immediately cancels the subscription.
        // Ensure 'userId' from the client is the Stripe Subscription ID (e.g., 'sub_xxxxxxxxxxxxxx').
        const cancelledSubscription = await stripeClient.subscriptions.del(userId);
        console.log('Stripe subscription successfully cancelled:', cancelledSubscription.id);

        cancellationData.status = 'completed';
        cancellationData.processor = 'stripe';
        const cancelRef = await db.collection('cancels').add(cancellationData);
        console.log('Saved successful Stripe cancellation record with ID:', cancelRef.id);
        
        return res.json({ 
          status: 'success', 
          message: 'Stripe subscription cancelled successfully.',
          processor: 'stripe',
          cancellationId: cancelRef.id,
          stripeSubscriptionId: cancelledSubscription.id
        });

      } catch (stripeError) {
        console.error('Stripe API cancellation error for subscription', userId, ':', stripeError.message);
        cancellationData.status = 'failed';
        cancellationData.processor = 'stripe';
        cancellationData.error = stripeError.message || 'Stripe API error';
        
        const cancelRef = await db.collection('cancels').add(cancellationData);
        console.log('Saved failed Stripe cancellation record with ID:', cancelRef.id);

        return res.status(stripeError.statusCode || 500).json({ 
          error: 'Failed to cancel Stripe subscription.', 
          details: stripeError.message,
          processor: 'stripe',
          cancellationId: cancelRef.id
        });
      }

    } else if (processor === 'paddle') {
      // Handle Paddle cancellation
      const paddleKeyField = vendor.paddleApiKey || vendor.paddle_api_key;
      const paddleVendorId = vendor.paddleVendorId || vendor.paddle_vendor_id;
      
      if (!paddleKeyField || !paddleVendorId) {
        return res.status(400).json({ error: 'Paddle configuration incomplete' });
      }

      console.log('DEBUG: Paddle key field (expecting plaintext string):', paddleKeyField ? typeof paddleKeyField : 'NOT FOUND');
      let paddleApiKey;
      try {
        paddleApiKey = paddleKeyField; // DEBUG: Using plaintext Paddle key
        console.log('DEBUG: paddleApiKey (plaintext) obtained.');
        
        // Log partial key for debugging (first 4 chars only for security)
        if (paddleApiKey && paddleApiKey.length > 4) {
          console.log('Paddle API key starts with:', paddleApiKey.substring(0, 4) + '...');
        } else {
          console.log('Warning: Paddle API key is empty or too short');
        }

      } catch (errorDuringKeyAccess) { // Renamed variable as it's no longer just decryption
        console.error('Error accessing or processing Paddle API key:', errorDuringKeyAccess);
        
        // Save failed cancellation record to Firestore
        cancellationData.status = 'failed';
        cancellationData.processor = 'paddle';
        cancellationData.error = 'Failed to decrypt API key: ' + decryptError.message;
        
        const cancelRef = await db.collection('cancels').add(cancellationData);
        console.log('Saved failed decryption record with ID:', cancelRef.id);
        
        return res.status(400).json({ 
          error: 'Failed to decrypt API key',
          cancellationId: cancelRef.id
        });
      }
      
      // Log subscription ID format
      console.log('Subscription ID format:', typeof userId, 'Length:', userId.length);
      
      // Paddle API call (New Billing API)
      // Ensure 'userId' is the Paddle Subscription ID (e.g., 'sub_xxxxxxxxxxxxxx')
      // IMPORTANT: Ensure 'paddleApiKey' (decrypted from Firestore) is the Paddle API Bearer token.
      const paddleApiUrl = `https://sandbox-api.paddle.com/subscriptions/${userId}/cancel`;
      console.log(`Calling Paddle Billing API: POST ${paddleApiUrl}`);
      const trimmedPaddleApiKey = paddleApiKey.trim();
      console.log(`Trimmed Paddle API Key - Type: ${typeof trimmedPaddleApiKey}, Length: ${trimmedPaddleApiKey.length}`);
      console.log(`Using Paddle API Key (Bearer): ${trimmedPaddleApiKey ? '********' + trimmedPaddleApiKey.substring(Math.max(0, trimmedPaddleApiKey.length - 4)) : 'NOT AVAILABLE'}`);

      let paddleResponse;
      let paddleResult;

      try {
        paddleResponse = await fetch(paddleApiUrl, {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + trimmedPaddleApiKey, // paddleApiKey is the Bearer token
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ effective_from: 'immediately' }), // Cancel immediately as per docs
        });

        console.log('Paddle API response status:', paddleResponse.status);
        paddleResult = await paddleResponse.json();
        console.log('Paddle API response body:', JSON.stringify(paddleResult));

        // Check if the HTTP request was successful
        if (!paddleResponse.ok) {
          console.error(`Paddle API error for subscription ${userId}:`, paddleResult);
          cancellationData.status = 'failed';
          cancellationData.processor = 'paddle';
          cancellationData.error = paddleResult.error?.detail || paddleResult.error?.message || `Paddle API request failed with status ${paddleResponse.status}`;
          
          const cancelRef = await db.collection('cancels').add(cancellationData);
          console.log('Saved failed cancellation record with ID:', cancelRef.id);
          
          return res.status(paddleResponse.status || 500).json({ 
            error: 'Failed to cancel Paddle subscription.', 
            details: paddleResult.error?.detail || paddleResult.error?.message || 'Unknown Paddle API error',
            cancellationId: cancelRef.id
          });
        }
        
        // According to Paddle docs, for immediate cancellation, status should be 'canceled'.
        if (paddleResult.data?.status !== 'canceled') {
          console.warn(`Paddle subscription ${userId} status is '${paddleResult.data?.status}' after immediate cancel request (expected 'canceled'). Proceeding as success due to HTTP ${paddleResponse.status}.`);
          // Business logic might require treating this as a soft failure or logging for monitoring.
        }

      } catch (fetchError) {
        console.error(`Network or other error during Paddle API call for subscription ${userId}:`, fetchError);
        cancellationData.status = 'failed';
        cancellationData.processor = 'paddle';
        cancellationData.error = fetchError.message || 'Network error during Paddle API call';
        
        const cancelRef = await db.collection('cancels').add(cancellationData);
        console.log('Saved failed cancellation record with ID:', cancelRef.id);
        
        return res.status(500).json({ 
          error: 'Failed to cancel Paddle subscription due to a network or fetch error.', 
          details: fetchError.message,
          cancellationId: cancelRef.id
        });
      }
      
      // Update cancellation record with success status
      cancellationData.status = 'completed';
      cancellationData.processor = 'paddle';
      
      // Save cancellation record to Firestore
      const cancelRef = await db.collection('cancels').add(cancellationData);
      console.log('Saved cancellation record with ID:', cancelRef.id);

      return res.json({ 
        status: 'success', 
        message: 'Paddle subscription cancelled',
        processor: 'paddle',
        cancellationId: cancelRef.id
      });

    } else {
      // Save unsupported processor cancellation record to Firestore
      cancellationData.status = 'failed';
      cancellationData.processor = processor || 'unknown';
      cancellationData.error = 'Unsupported payment processor';
      
      const cancelRef = await db.collection('cancels').add(cancellationData);
      console.log('Saved unsupported processor cancellation record with ID:', cancelRef.id);
      
      return res.status(400).json({ 
        error: 'Unsupported payment processor',
        cancellationId: cancelRef.id
      });
    }
  } catch (error) {
    console.error('Error in cancelHandler:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ---------- getVendor --------------------------------------------------
exports.getVendor = functions.https.onRequest(async (req, res) => {
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  
  if (req.method === 'OPTIONS') return res.status(204).send();
  if (req.method !== 'GET') return res.status(405).json({ error: 'GET only' });

  try {
    const vendorKey = req.query.vendorKey || req.path.split('/').pop();
    if (!vendorKey) {
      return res.status(400).json({ error: 'vendorKey required' });
    }

    const vendorDoc = await db.collection('vendors').doc(vendorKey).get();
    if (!vendorDoc.exists) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    const vendor = vendorDoc.data();
    
    // Remove sensitive data before sending
    delete vendor.stripe_api_key;
    delete vendor.paddle_api_key;

    return res.json(vendor);
  } catch (error) {
    console.error('Error getting vendor:', error);
    return res.status(500).json({ error: 'Failed to get vendor' });
  }
});

// Migration from Supabase is complete - all data is now in Firebase/Firestore