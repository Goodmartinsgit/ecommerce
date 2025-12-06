// Configuration Verification Script
// Run this with: node verify-config.js

import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file
config();

console.log('\n🔍 Verifying Flutterwave Configuration...\n');

let hasErrors = false;

// Check if .env file exists
const envPath = join(__dirname, '.env');
if (!existsSync(envPath)) {
  console.log('❌ .env file not found!');
  console.log('   Create one by copying .env.example:');
  console.log('   copy .env.example .env\n');
  hasErrors = true;
} else {
  console.log('✅ .env file exists\n');
}

// Check Flutterwave Public Key
const flwKey = process.env.VITE_FLUTTERWAVE_PUBLIC_KEY;

if (!flwKey) {
  console.log('❌ VITE_FLUTTERWAVE_PUBLIC_KEY is not set');
  console.log('   Add this to your .env file:');
  console.log('   VITE_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-your-key-here\n');
  hasErrors = true;
} else if (flwKey === 'FLWPUBK_TEST-your-public-key-here' || flwKey === 'your-public-key-here') {
  console.log('❌ VITE_FLUTTERWAVE_PUBLIC_KEY is using placeholder value');
  console.log('   Replace with your actual Flutterwave public key from:');
  console.log('   https://dashboard.flutterwave.com/settings/apis\n');
  hasErrors = true;
} else if (flwKey.startsWith('FLWPUBK_TEST-')) {
  console.log('✅ Flutterwave TEST public key configured');
  console.log(`   Key: ${flwKey.substring(0, 25)}...\n`);
  console.log('⚠️  Remember to use LIVE keys in production!\n');
} else if (flwKey.startsWith('FLWPUBK-')) {
  console.log('✅ Flutterwave LIVE public key configured');
  console.log(`   Key: ${flwKey.substring(0, 20)}...\n`);
  console.log('⚠️  Make sure you\'re in production mode!\n');
} else {
  console.log('⚠️  VITE_FLUTTERWAVE_PUBLIC_KEY format looks incorrect');
  console.log(`   Current value: ${flwKey.substring(0, 30)}...`);
  console.log('   Expected format: FLWPUBK_TEST-... or FLWPUBK-...\n');
  hasErrors = true;
}

// Check API Base URL
const apiUrl = process.env.VITE_API_BASE_URL;
if (!apiUrl) {
  console.log('⚠️  VITE_API_BASE_URL is not set (will use default)');
  console.log('   Default: https://ecombackend-xpdc.onrender.com/api/\n');
} else {
  console.log('✅ API Base URL configured');
  console.log(`   URL: ${apiUrl}\n`);
}

// Summary
console.log('─'.repeat(50));
if (hasErrors) {
  console.log('\n❌ Configuration has errors. Please fix them and restart the dev server.\n');
  console.log('After fixing, restart with: npm run dev\n');
  process.exit(1);
} else {
  console.log('\n✅ Configuration looks good!\n');
  console.log('Start the development server with: npm run dev\n');
  process.exit(0);
}
