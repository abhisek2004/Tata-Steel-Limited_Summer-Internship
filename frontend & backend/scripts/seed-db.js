#!/usr/bin/env node

/**
 * Script to seed the database with initial data
 * Run with: node scripts/seed-db.js
 */

const { execSync } = require('child_process');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

console.log(`${colors.bright}${colors.blue}=== Tata Steel Learning Platform - Database Seeding ===${colors.reset}\n`);

try {
  // Step 1: Generate Prisma client
  console.log(`${colors.yellow}Generating Prisma client...${colors.reset}`);
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log(`${colors.green}✓ Prisma client generated${colors.reset}\n`);

  // Step 2: Run database migrations
  console.log(`${colors.yellow}Running database migrations...${colors.reset}`);
  execSync('npx prisma migrate dev --name init', { stdio: 'inherit' });
  console.log(`${colors.green}✓ Database migrations applied${colors.reset}\n`);

  // Step 3: Seed the database
  console.log(`${colors.yellow}Seeding database with initial data...${colors.reset}`);
  execSync('npx prisma db seed', { stdio: 'inherit' });
  console.log(`${colors.green}✓ Database seeded successfully${colors.reset}\n`);

  console.log(`${colors.bright}${colors.green}Database setup complete!${colors.reset}`);
  console.log(`${colors.blue}You can now start the application with:${colors.reset}`);
  console.log(`${colors.dim}npm run dev${colors.reset}`);
  console.log(`${colors.dim}# or${colors.reset}`);
  console.log(`${colors.dim}yarn dev${colors.reset}`);
  console.log(`${colors.dim}# or${colors.reset}`);
  console.log(`${colors.dim}pnpm dev${colors.reset}`);

} catch (error) {
  console.error(`${colors.red}Error during database setup:${colors.reset}`, error.message);
  process.exit(1);
}