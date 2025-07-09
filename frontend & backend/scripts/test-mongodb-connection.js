// This script tests the MongoDB connection
const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  console.log('Testing MongoDB connection...');
  
  try {
    const prisma = new PrismaClient();
    
    // Test the connection by running a simple query
    console.log('Connecting to MongoDB...');
    const result = await prisma.$runCommandRaw({
      ping: 1
    });
    
    console.log('Connection successful!');
    console.log('MongoDB server response:', result);
    
    // Close the connection
    await prisma.$disconnect();
    
    return true;
  } catch (error) {
    console.error('Connection failed:', error);
    return false;
  }
}

// Run the test
testConnection()
  .then(success => {
    if (success) {
      console.log('\nMongoDB connection test passed!');
      process.exit(0);
    } else {
      console.error('\nMongoDB connection test failed!');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });