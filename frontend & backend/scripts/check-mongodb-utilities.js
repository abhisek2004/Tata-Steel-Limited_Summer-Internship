// This script checks if all MongoDB utilities are installed and working properly
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('=== MongoDB Utilities Check ===\n');

// Define the utility scripts to check
const utilities = [
  { name: 'MongoDB Setup Script', path: 'scripts/setup-mongodb.js' },
  { name: 'MongoDB Connection Test', path: 'scripts/test-mongodb-connection.js' },
  { name: 'MongoDB URL Validator', path: 'scripts/validate-mongodb-url.js' },
  { name: 'MongoDB Atlas Connectivity Check', path: 'scripts/check-mongodb-atlas-connectivity.js' },
  { name: 'MongoDB Connection String Check', path: 'scripts/check-mongodb-connection-string.js' },
  { name: 'Prisma Client Generator', path: 'scripts/generate-prisma-client.js' },
  { name: 'SQLite to MongoDB Migration', path: 'scripts/migrate-sqlite-to-mongodb.js' },
  { name: 'Database Switching Utility', path: 'scripts/switch-database.js' }
];

// Define the documentation files to check
const docs = [
  { name: 'MongoDB Migration Guide', path: 'MONGODB_MIGRATION.md' },
  { name: 'MongoDB Setup Guide', path: 'MONGODB_SETUP_GUIDE.md' },
  { name: 'MongoDB Troubleshooting Guide', path: 'MONGODB_TROUBLESHOOTING.md' },
  { name: 'JWT Authentication Guide', path: 'JWT_AUTH.md' }
];

// Check if package.json has the required scripts
function checkPackageScripts() {
  console.log('Checking package.json scripts...');
  
  try {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    const requiredScripts = [
      'setup:mongodb',
      'test:mongodb',
      'validate:mongodb-url',
      'check:atlas-connectivity',
      'check:connection-string',
      'generate:client',
      'migrate:sqlite-to-mongodb',
      'switch:database'
    ];
    
    const missingScripts = [];
    
    for (const script of requiredScripts) {
      if (!packageJson.scripts || !packageJson.scripts[script]) {
        missingScripts.push(script);
      }
    }
    
    if (missingScripts.length === 0) {
      console.log('✓ All required scripts are present in package.json');
    } else {
      console.log(`✗ Missing scripts in package.json: ${missingScripts.join(', ')}`);
    }
    
    console.log();
  } catch (error) {
    console.error('Error checking package.json:', error.message);
    console.log();
  }
}

// Check if utility scripts exist
function checkUtilityScripts() {
  console.log('Checking utility scripts...');
  
  const missingScripts = [];
  
  for (const utility of utilities) {
    const scriptPath = path.join(process.cwd(), utility.path);
    
    if (fs.existsSync(scriptPath)) {
      console.log(`✓ ${utility.name} (${utility.path})`);
    } else {
      console.log(`✗ ${utility.name} (${utility.path}) - MISSING`);
      missingScripts.push(utility.path);
    }
  }
  
  console.log();
  
  if (missingScripts.length > 0) {
    console.log('Missing utility scripts:');
    for (const script of missingScripts) {
      console.log(`- ${script}`);
    }
    console.log();
  }
}

// Check if documentation files exist
function checkDocumentation() {
  console.log('Checking documentation files...');
  
  const missingDocs = [];
  
  for (const doc of docs) {
    const docPath = path.join(process.cwd(), doc.path);
    
    if (fs.existsSync(docPath)) {
      console.log(`✓ ${doc.name} (${doc.path})`);
    } else {
      console.log(`✗ ${doc.name} (${doc.path}) - MISSING`);
      missingDocs.push(doc.path);
    }
  }
  
  console.log();
  
  if (missingDocs.length > 0) {
    console.log('Missing documentation files:');
    for (const doc of missingDocs) {
      console.log(`- ${doc}`);
    }
    console.log();
  }
}

// Check if .env file has MongoDB configuration
function checkEnvFile() {
  console.log('Checking .env file...');
  
  try {
    const envPath = path.join(process.cwd(), '.env');
    
    if (!fs.existsSync(envPath)) {
      console.log('✗ .env file is missing');
      console.log();
      return;
    }
    
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    // Check for DATABASE_URL
    const hasDbUrl = envContent.includes('DATABASE_URL=');
    console.log(`${hasDbUrl ? '✓' : '✗'} DATABASE_URL in .env`);
    
    // Check if it's a MongoDB URL
    const isMongoUrl = envContent.includes('mongodb');
    console.log(`${isMongoUrl ? '✓' : '✗'} MongoDB connection string in .env`);
    
    // Check for JWT_SECRET
    const hasJwtSecret = envContent.includes('JWT_SECRET=');
    console.log(`${hasJwtSecret ? '✓' : '✗'} JWT_SECRET in .env`);
    
    // Check for NEXTAUTH_SECRET
    const hasNextAuthSecret = envContent.includes('NEXTAUTH_SECRET=');
    console.log(`${hasNextAuthSecret ? '✓' : '✗'} NEXTAUTH_SECRET in .env`);
    
    console.log();
  } catch (error) {
    console.error('Error checking .env file:', error.message);
    console.log();
  }
}

// Check if Prisma schema has MongoDB provider
function checkPrismaSchema() {
  console.log('Checking Prisma schema...');
  
  try {
    const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
    
    if (!fs.existsSync(schemaPath)) {
      console.log('✗ Prisma schema file is missing');
      console.log();
      return;
    }
    
    const schemaContent = fs.readFileSync(schemaPath, 'utf8');
    
    // Check for MongoDB provider
    const hasMongoProvider = schemaContent.includes('provider = "mongodb"');
    console.log(`${hasMongoProvider ? '✓' : '✗'} MongoDB provider in Prisma schema`);
    
    console.log();
  } catch (error) {
    console.error('Error checking Prisma schema:', error.message);
    console.log();
  }
}

// Check if required npm packages are installed
function checkRequiredPackages() {
  console.log('Checking required npm packages...');
  
  const requiredPackages = [
    '@prisma/client',
    'prisma'
  ];
  
  try {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    for (const pkg of requiredPackages) {
      if (dependencies[pkg]) {
        console.log(`✓ ${pkg} (${dependencies[pkg]})`);
      } else {
        console.log(`✗ ${pkg} - MISSING`);
      }
    }
    
    console.log();
  } catch (error) {
    console.error('Error checking required packages:', error.message);
    console.log();
  }
}

// Run all checks
function runAllChecks() {
  checkPackageScripts();
  checkUtilityScripts();
  checkDocumentation();
  checkEnvFile();
  checkPrismaSchema();
  checkRequiredPackages();
  
  console.log('=== MongoDB Utilities Check Complete ===');
}

runAllChecks();