// This script sets up the MongoDB database using Prisma
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

// Helper function to execute commands and log output
function runCommand(command, errorMessage) {
  try {
    console.log(`${colors.cyan}> ${command}${colors.reset}`);
    const output = execSync(command, { stdio: 'inherit' });
    return output;
  } catch (error) {
    console.error(`${colors.red}${colors.bright}Error: ${errorMessage}${colors.reset}`);
    console.error(`${colors.red}${error.message}${colors.reset}`);
    process.exit(1);
  }
}

// Main function to run the setup
async function setupMongoDB() {
  console.log(`\n${colors.bright}${colors.green}=== Setting up MongoDB Database ===${colors.reset}\n`);
  
  // Step 1: Generate Prisma client
  console.log(`\n${colors.yellow}Step 1: Generating Prisma client...${colors.reset}`);
  runCommand('npx prisma generate', 'Failed to generate Prisma client');
  
  // Step 2: Push schema to MongoDB (instead of migrations for MongoDB)
  console.log(`\n${colors.yellow}Step 2: Pushing schema to MongoDB...${colors.reset}`);
  runCommand('npx prisma db push', 'Failed to push schema to MongoDB');
  
  // Step 3: Seed the database with initial data
  console.log(`\n${colors.yellow}Step 3: Seeding the database...${colors.reset}`);
  runCommand('npx prisma db seed', 'Failed to seed the database');
  
  console.log(`\n${colors.bright}${colors.green}=== MongoDB Database Setup Complete ===${colors.reset}\n`);
  console.log(`${colors.cyan}You can now start the application with:${colors.reset}`);
  console.log(`${colors.bright}npm run dev${colors.reset}\n`);
}

// Run the setup
setupMongoDB().catch(error => {
  console.error(`${colors.red}${colors.bright}Setup failed:${colors.reset}`, error);
  process.exit(1);
});