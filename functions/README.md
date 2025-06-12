# CancelKit Firebase Cloud Function

This Firebase Cloud Function handles subscription cancellations by validating requests, canceling Stripe subscriptions, and logging the cancellation details to Supabase.

## Prerequisites

- Firebase account and project
- Stripe account
- Supabase account and project
- Node.js 18

## Setup

1. Install Firebase CLI:
   ```
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```
   firebase login
   ```

3. Initialize Firebase in this directory (if not already done):
   ```
   firebase init functions
   ```
   - Select your Firebase project
   - Choose JavaScript
   - Say no to ESLint
   - Say yes to installing dependencies

4. Install dependencies:
   ```
   cd functions
   npm install
   ```

5. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your Stripe and Supabase credentials
   - Deploy environment variables to Firebase:
     ```
     firebase functions:config:set stripe.key="YOUR_STRIPE_SECRET_KEY" supabase.url="YOUR_SUPABASE_URL" supabase.key="YOUR_SUPABASE_SERVICE_KEY" vendor.keys="key1,key2,key3"
     ```

6. Create the `cancels` table in Supabase with the following schema:
   - `id`: uuid (primary key)
   - `userId`: text
   - `time`: timestamp with timezone
   - `ip`: text
   - `result`: jsonb
   - `vendorKey`: text

## Deployment

Deploy the function to Firebase:
```
firebase deploy --only functions
```

## Usage

The function expects a POST request with:

### Headers:
- `vendorKey`: Your vendor API key

### Body:
```json
{
  "userId": "user_123"
}
```

### Response:
```json
{
  "status": "done"
}
```

## Error Handling

The function returns appropriate HTTP status codes and error messages:
- 401: Missing vendorKey
- 403: Invalid vendorKey
- 400: Missing userId
- 404: Customer not found or no active subscriptions
- 500: Server error

## Local Testing

Run the Firebase emulator:
```
firebase emulators:start
```

Then send test requests to your local endpoint.
