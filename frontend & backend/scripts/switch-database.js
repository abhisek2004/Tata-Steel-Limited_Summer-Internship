// This script helps users switch between MongoDB and SQLite databases
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Path to .env file
const envPath = path.join(process.cwd(), '.env');

// Function to read current .env file
function readEnvFile() {
  try {
    return fs.readFileSync(envPath, 'utf8');
  } catch (error) {
    console.error('Error reading .env file:', error.message);
    process.exit(1);
  }
}

// Function to write to .env file
function writeEnvFile(content) {
  try {
    fs.writeFileSync(envPath, content, 'utf8');
    console.log('.env file updated successfully!');
  } catch (error) {
    console.error('Error writing to .env file:', error.message);
    process.exit(1);
  }
}

// Function to extract current DATABASE_URL
function getCurrentDatabaseUrl(envContent) {
  const match = envContent.match(/DATABASE_URL="([^"]*)"/i);
  return match ? match[1] : null;
}

// Function to determine current database type
function getCurrentDatabaseType(databaseUrl) {
  if (!databaseUrl) return 'unknown';
  if (databaseUrl.startsWith('mongodb')) return 'mongodb';
  if (databaseUrl.includes('file:./')) return 'sqlite';
  return 'unknown';
}

// Function to update DATABASE_URL in .env file
function updateDatabaseUrl(envContent, newUrl) {
  return envContent.replace(
    /DATABASE_URL="([^"]*)"/i,
    `DATABASE_URL="${newUrl}"`
  );
}

// Function to backup current .env file
function backupEnvFile() {
  try {
    const backupPath = `${envPath}.backup-${Date.now()}`;
    fs.copyFileSync(envPath, backupPath);
    console.log(`Backup created at ${backupPath}`);
  } catch (error) {
    console.error('Error creating backup:', error.message);
  }
}

// Function to run database setup
async function setupDatabase(dbType) {
  console.log(`\nSetting up ${dbType} database...`);
  
  try {
    if (dbType === 'mongodb') {
      console.log('Generating Prisma client...');
      execSync('npx prisma generate', { stdio: 'inherit' });
      
      console.log('\nPushing schema to MongoDB...');
      execSync('npx prisma db push', { stdio: 'inherit' });
      
      console.log('\nSeeding database...');
      execSync('npx prisma db seed', { stdio: 'inherit' });
    } else if (dbType === 'sqlite') {
      console.log('Generating Prisma client...');
      execSync('npx prisma generate', { stdio: 'inherit' });
      
      console.log('\nPushing schema to SQLite...');
      execSync('npx prisma db push', { stdio: 'inherit' });
      
      console.log('\nSeeding database...');
      execSync('npx prisma db seed', { stdio: 'inherit' });
    }
    
    console.log(`\n✓ ${dbType.toUpperCase()} database setup completed successfully!`);
  } catch (error) {
    console.error(`\n✗ Error setting up ${dbType} database:`, error.message);
    console.log('Please check the logs above for more details.');
  }
}

// Main function
async function switchDatabase() {
  console.log('=== Database Switching Utility ===\n');
  
  // Read current .env file
  const envContent = readEnvFile();
  const currentUrl = getCurrentDatabaseUrl(envContent);
  const currentType = getCurrentDatabaseType(currentUrl);
  
  console.log(`Current database: ${currentType.toUpperCase()}`);
  if (currentUrl) {
    console.log(`Current DATABASE_URL: ${currentUrl}`);
  } else {
    console.log('No DATABASE_URL found in .env file.');
  }
  
  console.log('\nAvailable options:');
  console.log('1. Switch to MongoDB');
  console.log('2. Switch to SQLite');
  console.log('3. Exit');
  
  rl.question('\nEnter your choice (1-3): ', async (choice) => {
    switch (choice) {
      case '1': {
        if (currentType === 'mongodb') {
          console.log('Already using MongoDB. No changes needed.');
          rl.close();
          return;
        }
        
        rl.question('Enter MongoDB connection string: ', async (mongoUrl) => {
          if (!mongoUrl.trim()) {
            console.log('MongoDB connection string cannot be empty. Exiting...');
            rl.close();
            return;
          }
          
          // Backup current .env file
          backupEnvFile();
          
          // Update .env file with MongoDB URL
          const updatedContent = updateDatabaseUrl(envContent, mongoUrl);
          writeEnvFile(updatedContent);
          
          // Ask if user wants to set up the database
          rl.question('\nDo you want to set up the MongoDB database now? (y/n): ', async (answer) => {
            if (answer.toLowerCase() === 'y') {
              await setupDatabase('mongodb');
            }
            rl.close();
          });
        });
        break;
      }
      
      case '2': {
        if (currentType === 'sqlite') {
          console.log('Already using SQLite. No changes needed.');
          rl.close();
          return;
        }
        
        // Backup current .env file
        backupEnvFile();
        
        // Update .env file with SQLite URL
        const sqliteUrl = 'file:./dev.db';
        const updatedContent = updateDatabaseUrl(envContent, sqliteUrl);
        writeEnvFile(updatedContent);
        
        // Ask if user wants to set up the database
        rl.question('\nDo you want to set up the SQLite database now? (y/n): ', async (answer) => {
          if (answer.toLowerCase() === 'y') {
            await setupDatabase('sqlite');
          }
          rl.close();
        });
        break;
      }
      
      case '3':
      default:
        console.log('Exiting...');
        rl.close();
        break;
    }
  });
}

// Start the script
switchDatabase();