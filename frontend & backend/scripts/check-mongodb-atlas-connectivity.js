// This script checks if MongoDB Atlas is accessible from the current network
const https = require('https');

console.log('Checking MongoDB Atlas connectivity...');

// Function to check if MongoDB Atlas is accessible
function checkMongoDBAtlasConnectivity() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'cloud.mongodb.com',
      port: 443,
      path: '/api/atlas/v1.0',
      method: 'GET',
      timeout: 10000 // 10 seconds timeout
    };

    const req = https.request(options, (res) => {
      // Any response means we can reach MongoDB Atlas
      console.log(`MongoDB Atlas status code: ${res.statusCode}`);
      resolve(true);
    });

    req.on('error', (error) => {
      console.error('Error connecting to MongoDB Atlas:', error.message);
      resolve(false);
    });

    req.on('timeout', () => {
      console.error('Connection to MongoDB Atlas timed out');
      req.destroy();
      resolve(false);
    });

    req.end();
  });
}

// Function to check if the MongoDB Atlas domain is resolvable
function checkDNSResolution() {
  return new Promise((resolve, reject) => {
    const dns = require('dns');
    
    // Extract the hostname from the DATABASE_URL
    require('dotenv').config();
    const url = process.env.DATABASE_URL || '';
    let hostname = '';
    
    try {
      if (url.includes('@') && url.includes('/')) {
        hostname = url.split('@')[1].split('/')[0];
        // Remove port if present
        hostname = hostname.split(':')[0];
      }
    } catch (error) {
      console.error('Error extracting hostname from DATABASE_URL:', error.message);
      resolve(false);
      return;
    }
    
    if (!hostname) {
      console.error('Could not extract hostname from DATABASE_URL');
      resolve(false);
      return;
    }
    
    console.log(`Checking DNS resolution for: ${hostname}`);
    
    dns.lookup(hostname, (err, address) => {
      if (err) {
        console.error(`DNS resolution failed for ${hostname}:`, err.message);
        resolve(false);
      } else {
        console.log(`DNS resolution successful for ${hostname}: ${address}`);
        resolve(true);
      }
    });
  });
}

// Run the checks
async function runChecks() {
  console.log('\n=== MongoDB Atlas Connectivity Check ===\n');
  
  // Check 1: DNS Resolution
  console.log('\n1. Checking DNS resolution...');
  const dnsResolved = await checkDNSResolution();
  
  // Check 2: MongoDB Atlas Accessibility
  console.log('\n2. Checking MongoDB Atlas service accessibility...');
  const atlasAccessible = await checkMongoDBAtlasConnectivity();
  
  // Summary
  console.log('\n=== Connectivity Check Summary ===');
  console.log(`DNS Resolution: ${dnsResolved ? '✓ PASSED' : '✗ FAILED'}`);
  console.log(`Atlas Accessibility: ${atlasAccessible ? '✓ PASSED' : '✗ FAILED'}`);
  
  if (dnsResolved && atlasAccessible) {
    console.log('\n✓ Your network appears to have connectivity to MongoDB Atlas.');
    console.log('If you still have connection issues, please check:');
    console.log('- Your MongoDB Atlas username and password');
    console.log('- Network whitelist settings in MongoDB Atlas');
    console.log('- Firewall or proxy settings on your network');
    process.exit(0);
  } else {
    console.log('\n✗ There appear to be connectivity issues with MongoDB Atlas.');
    console.log('Please check:');
    console.log('- Your internet connection');
    console.log('- Firewall or proxy settings on your network');
    console.log('- VPN settings if you are using a VPN');
    process.exit(1);
  }
}

runChecks().catch(error => {
  console.error('Error running connectivity checks:', error);
  process.exit(1);
});