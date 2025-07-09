// This script validates the MongoDB connection URL format
require('dotenv').config();

function validateMongoDBUrl() {
  const url = process.env.DATABASE_URL;
  
  console.log('Validating MongoDB connection URL...');
  
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
  
  // Parse the URL to check for required components
  try {
    // Extract username and password
    let hasCredentials = false;
    if (url.includes('@')) {
      const credentialsPart = url.split('@')[0].split('://')[1];
      if (credentialsPart.includes(':')) {
        const [username, password] = credentialsPart.split(':');
        if (username && password) {
          hasCredentials = true;
          console.log('✓ Username and password found');
        } else {
          console.warn('Warning: Username or password may be missing');
        }
      }
    }
    
    if (!hasCredentials) {
      console.warn('Warning: No credentials found in the connection string');
    }
    
    // Check for database name
    let hasDatabase = false;
    if (url.includes('/')) {
      const parts = url.split('/');
      const lastPart = parts[parts.length - 1].split('?')[0];
      if (lastPart && lastPart.length > 0) {
        hasDatabase = true;
        console.log(`✓ Database name found: ${lastPart}`);
      }
    }
    
    if (!hasDatabase) {
      console.warn('Warning: No database name found in the connection string');
    }
    
    console.log('✓ MongoDB URL format is valid');
    return true;
  } catch (error) {
    console.error('Error parsing MongoDB URL:', error.message);
    return false;
  }
}

const isValid = validateMongoDBUrl();

if (isValid) {
  console.log('\nMongoDB URL validation passed!');
  process.exit(0);
} else {
  console.error('\nMongoDB URL validation failed!');
  process.exit(1);
}