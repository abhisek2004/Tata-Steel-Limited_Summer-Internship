// This script only generates the Prisma client
const { execSync } = require('child_process');

console.log('Generating Prisma client...');

try {
  console.log('> npx prisma generate');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('Prisma client generated successfully!');
  process.exit(0);
} catch (error) {
  console.error('Failed to generate Prisma client:', error.message);
  process.exit(1);
}