# CancelKit 🚫

![CancelKit Logo](./git_images/cancelkit_logo.png)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow.svg)](https://www.ecma-international.org/ecma-262/6.0/)
[![Firebase](https://img.shields.io/badge/Firebase-Hosting%20%7C%20Functions-orange.svg)](https://firebase.google.com/)
[![Next.js](https://img.shields.io/badge/Next.js-Framework-black.svg)](https://nextjs.org/)

A lightweight, developer-friendly JavaScript library for adding subscription cancellation functionality to any website. This repository contains both the CancelKit library and a unified web application with marketing website, onboarding, and dashboard functionality.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration Options](#configuration-options)
- [API Integration](#api-integration)
- [Local Development](#local-development)
- [Deployment](#deployment)
- [Security Considerations](#security-considerations)
- [Contributing](#contributing)
- [License](#license)

## 🔍 Overview

CancelKit provides a simple, drop-in solution for handling subscription cancellations on your website. It creates a customizable cancellation button and modal that integrates with popular payment processors like Stripe and Paddle.

![CancelKit Homepage](./git_images/CancelReady%20-%20FTC-Compliant%20Subscription%20Cancellation.jpeg)

## ✨ Features

- **Simple Integration**: Add cancellation functionality with just a few lines of code
- **Multiple Payment Processors**: Support for Stripe and Paddle (extensible to others)
- **Customizable UI**: Easily change button text, colors, and modal content
- **Tailwind CSS**: Styling automatically injected for consistent design
- **Toast Notifications**: Built-in success/error notifications
- **Secure API**: Backend functions for secure cancellation processing
- **Dashboard**: Admin interface for tracking and managing cancellations
- **Analytics**: Track cancellation rates and reasons

## 📁 Project Structure

```
├── cancelkit.js             # Main library source code
├── cancelkit.min.js         # Minified library for production use
├── demo.html                # Demo implementation
├── functions/               # Firebase Cloud Functions
│   ├── index.js             # API endpoints for cancellation processing
│   └── templates/           # Email templates
├── dashboard/               # Admin dashboard application
├── website/                 # Marketing website (Next.js)
│   ├── components/          # React components
│   ├── pages/               # Next.js pages
│   └── public/              # Static assets
└── .env.example            # Example environment variables
```

## 🚀 Quick Start

1. Include the script in your HTML:
   ```html
   <script src="https://your-domain.com/cancelkit.min.js"></script>
   ```

2. Add a target div where you want the cancel button to appear:
   ```html
   <div id="cr-target"></div>
   ```

3. Initialize with your configuration:
   ```javascript
   CancelKit.init({
     vendorKey: 'your_vendor_key',
     userId: 'user_subscription_id'
   });
   ```

![Documentation](./git_images/Documentation%20-%20CancelReady.jpeg)

## 📦 Installation

### Option 1: CDN (Recommended)

Include the minified script in your HTML:

```html
<script src="https://your-domain.com/cancelkit.min.js"></script>
```

### Option 2: Self-hosted

1. Download `cancelkit.min.js` from this repository
2. Host it on your own server
3. Include it in your HTML:
   ```html
   <script src="/path/to/cancelkit.min.js"></script>
   ```

## 🔧 Usage

1. Add a target div with the ID `cr-target` where you want the cancel button to appear:

```html
<div id="cr-target"></div>
```

2. Initialize CancelKit with your configuration:

```javascript
CancelKit.init({
  vendorKey: 'your_vendor_key',  // Your unique vendor identifier
  userId: 'user_id'              // The user's subscription ID
});
```

## ⚙️ Configuration Options

You can customize CancelKit by passing options to the `init` function:

```javascript
CancelKit.init({
  // Required parameters
  vendorKey: 'your_vendor_key',       // Your unique vendor identifier
  userId: 'user_id',                  // The user's subscription ID
  
  // Optional parameters
  buttonText: 'Cancel subscription',  // Custom button text
  buttonColor: '#ef4444',             // Custom button color (hex)
  modalTitle: 'Cancel Subscription',  // Custom modal title
  modalMessage: 'Are you sure?',      // Custom confirmation message
  confirmButtonText: 'Yes, cancel',   // Custom confirm button text
  cancelButtonText: 'No, keep it',    // Custom cancel button text
  apiUrl: 'https://api.example.com',  // Custom API endpoint
  successMessage: 'Canceled!',        // Custom success message
  errorMessage: 'Failed to cancel',   // Custom error message
  testMode: false                     // Set to true for testing without processing real cancellations
});
```

## 🔌 API Integration

When a user confirms cancellation, CancelKit sends a POST request to the configured API endpoint with the following JSON payload:

```json
{
  "vendorKey": "your_vendor_key",
  "userId": "user_id",
  "email": "user@example.com",     // Optional
  "reason": "switching_services",   // Optional
  "feedback": "Your service was great, but..."  // Optional
}
```

### Supported Payment Processors

- **Stripe**: Uses the Stripe API to cancel subscriptions
- **Paddle**: Uses the Paddle Billing API to cancel subscriptions

![Tutorials](./git_images/Tutorials%20-%20CancelReady%20Documentation.jpeg)

## 💻 Local Development

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Firebase CLI (`npm install -g firebase-tools`)

### Setup

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/cancelkit.git
   cd cancelkit
   ```

2. Create environment files:
   - Copy `.env.example` to `.env` in the root directory
   - Copy `.env.example` to `.env` in the functions directory
   - Copy `.env.example` to `.env.local` in the website directory

3. Install dependencies:
   ```bash
   # Install functions dependencies
   cd functions
   npm install
   cd ..
   
   # Install website dependencies
   cd website
   npm install
   cd ..
   ```

4. Start the development server:
   ```bash
   # Start Firebase emulators
   firebase emulators:start
   
   # In another terminal, start the Next.js dev server
   cd website
   npm run dev
   ```

## 🚢 Deployment

### Firebase Setup

1. Create a Firebase project at [firebase.google.com](https://firebase.google.com)
2. Initialize Firebase in your project:
   ```bash
   firebase login
   firebase init
   ```

### Deploy to Firebase

```bash
# Build the Next.js application
cd website
npm run build
cd ..

# Deploy to Firebase
firebase deploy
```

![Pricing](./git_images/Pricing%20-%20CancelReady.jpeg)

## 🔒 Security Considerations

- **API Keys**: Never expose API keys in client-side code. Use environment variables and server-side processing.
- **Authentication**: Implement proper authentication to ensure only authorized users can cancel their own subscriptions.
- **Encryption**: Sensitive data is encrypted using AES-256-GCM.
- **Environment Variables**: Store all sensitive credentials in environment variables.

![Compliance](./git_images/Compliance%20Statement%20-%20CancelKit.jpeg)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

![Support](./git_images/Support%20-%20CancelKit.jpeg)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ by Prajwal.v.v
