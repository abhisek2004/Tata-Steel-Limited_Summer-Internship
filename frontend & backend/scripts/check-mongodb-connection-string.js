// This script checks if the MongoDB connection string is valid
require('dotenv').config();

function checkMongoDBConnectionString() {
  const url = process.env.DATABASE_URL;
  
  console.log('\n=== MongoDB Connection String Check ===\n');
  
  if (!url) {
    console.error('Error: DATABASE_URL is not defined in the .env file');
    return false;
  }
  
  // Check if it's a MongoDB URL
  if (!url.startsWith('mongodb://') && !url.startsWith('mongodb+srv://')) {
    console.error('Error: DATABASE_URL does not appear to be a valid MongoDB connection string');
    console.error('It should start with "mongodb://" or "mongodb+srv://"');
    return false;
  }
  
  // Parse the URL to extract components
  try {
    console.log('Parsing MongoDB connection string...');
    
    // Extract protocol
    const protocol = url.startsWith('mongodb+srv://') ? 'mongodb+srv' : 'mongodb';
    console.log(`Protocol: ${protocol}`);
    
    // Extract credentials and host
    let credentials = '';
    let host = '';
    let database = '';
    let options = '';
    
    if (url.includes('@')) {
      // URL has credentials
      const parts = url.split('@');
      credentials = parts[0].replace(`${protocol}://`, '');
      const remainder = parts[1];
      
      // Extract host and database
      if (remainder.includes('/')) {
        const hostAndRest = remainder.split('/');
        host = hostAndRest[0];
        const dbAndOptions = hostAndRest.slice(1).join('/');
        
        // Extract database and options
        if (dbAndOptions.includes('?')) {
          const dbParts = dbAndOptions.split('?');
          database = dbParts[0];
          options = dbParts[1];
        } else {
          database = dbAndOptions;
        }
      } else {
        host = remainder;
      }
    } else {
      // URL has no credentials
      const parts = url.replace(`${protocol}://`, '').split('/');
      host = parts[0];
      if (parts.length > 1) {
        const dbAndOptions = parts.slice(1).join('/');
        if (dbAndOptions.includes('?')) {
          const dbParts = dbAndOptions.split('?');
          database = dbParts[0];
          options = dbParts[1];
        } else {
          database = dbAndOptions;
        }
      }
    }
    
    // Mask credentials for security
    let maskedCredentials = '';
    if (credentials) {
      if (credentials.includes(':')) {
        const [username, password] = credentials.split(':');
        maskedCredentials = `${username}:${'*'.repeat(Math.min(password.length, 10))}`;
      } else {
        maskedCredentials = credentials;
      }
    }
    
    console.log('\nConnection String Components:');
    console.log(`- Host: ${host}`);
    console.log(`- Database: ${database || '(none specified)'}`);
    console.log(`- Credentials: ${maskedCredentials ? 'Present (masked for security)' : 'None'}`);
    console.log(`- Options: ${options ? 'Present' : 'None'}`);
    
    // Validate components
    let isValid = true;
    let issues = [];
    
    if (!host) {
      isValid = false;
      issues.push('Missing host in connection string');
    }
    
    if (!database) {
      issues.push('Warning: No database specified in connection string');
    }
    
    if (!credentials && protocol === 'mongodb+srv') {
      issues.push('Warning: No credentials in connection string for MongoDB Atlas');
    }
    
    // Check for common MongoDB Atlas hostnames
    const isAtlas = host.includes('mongodb.net') || host.includes('mongodb.com');
    console.log(`\nConnection Type: ${isAtlas ? 'MongoDB Atlas (cloud)' : 'Standard MongoDB (could be local or self-hosted)'}`);
    
    if (issues.length > 0) {
      console.log('\nIssues Found:');
      issues.forEach(issue => console.log(`- ${issue}`));
    }
    
    return isValid;
  } catch (error) {
    console.error('Error parsing MongoDB connection string:', error.message);
    return false;
  }
}

const isValid = checkMongoDBConnectionString();

console.log('\n=== Connection String Check Result ===');
if (isValid) {
  console.log('✓ MongoDB connection string format appears valid');
  console.log('\nNext Steps:');
  console.log('1. Run network connectivity check: npm run check:atlas-connectivity');
  console.log('2. Try generating Prisma client: npm run generate:client');
  process.exit(0);
} else {
  console.error('✗ MongoDB connection string has issues that need to be fixed');
  console.log('\nPlease check the MongoDB Troubleshooting Guide for more information.');
  process.exit(1);
}