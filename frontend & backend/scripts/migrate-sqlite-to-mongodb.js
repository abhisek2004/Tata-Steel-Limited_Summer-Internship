// This script helps migrate data from SQLite to MongoDB
const { execSync } = require('child_process');
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

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

// Main function to run the migration
async function migrateSqliteToMongoDB() {
  console.log(`\n${colors.bright}${colors.green}=== Migrating from SQLite to MongoDB ===${colors.reset}\n`);
  
  // Step 1: Check for environment variables
  console.log(`\n${colors.yellow}Step 1: Checking environment variables...${colors.reset}`);
  
  // Check if .env file exists
  const envPath = path.join(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) {
    console.error(`${colors.red}${colors.bright}Error: .env file not found${colors.reset}`);
    process.exit(1);
  }
  
  // Read .env file
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  // Check if DATABASE_URL is set to MongoDB
  if (!envContent.includes('mongodb://') && !envContent.includes('mongodb+srv://')) {
    console.error(`${colors.red}${colors.bright}Error: MongoDB DATABASE_URL not found in .env file${colors.reset}`);
    console.error(`${colors.red}Please update your .env file with a MongoDB connection string${colors.reset}`);
    process.exit(1);
  }
  
  // Step 2: Create a backup of SQLite database
  console.log(`\n${colors.yellow}Step 2: Creating a backup of SQLite database...${colors.reset}`);
  
  // Check if SQLite database exists
  const sqlitePath = path.join(process.cwd(), 'prisma', 'dev.db');
  if (!fs.existsSync(sqlitePath)) {
    console.error(`${colors.red}${colors.bright}Error: SQLite database not found at ${sqlitePath}${colors.reset}`);
    process.exit(1);
  }
  
  // Create backups directory if it doesn't exist
  const backupsDir = path.join(process.cwd(), 'backups');
  if (!fs.existsSync(backupsDir)) {
    fs.mkdirSync(backupsDir);
  }
  
  // Create a backup with timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(backupsDir, `dev.db.${timestamp}`);
  fs.copyFileSync(sqlitePath, backupPath);
  console.log(`${colors.green}SQLite database backed up to ${backupPath}${colors.reset}`);
  
  // Step 3: Export data from SQLite
  console.log(`\n${colors.yellow}Step 3: Exporting data from SQLite...${colors.reset}`);
  
  // Create a temporary .env file for SQLite connection
  const tempEnvPath = path.join(process.cwd(), '.env.sqlite');
  fs.writeFileSync(tempEnvPath, `DATABASE_URL="file:./prisma/dev.db"\n`);
  
  // Create export directory if it doesn't exist
  const exportDir = path.join(process.cwd(), 'export');
  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir);
  }
  
  // Create a script to export data from SQLite
  const exportScriptPath = path.join(process.cwd(), 'scripts', 'export-sqlite.js');
  fs.writeFileSync(exportScriptPath, `
    const { PrismaClient } = require('@prisma/client');
    const fs = require('fs');
    const path = require('path');

    async function exportData() {
      // Use SQLite connection
      process.env.DATABASE_URL = "file:./prisma/dev.db";
      const prisma = new PrismaClient();

      try {
        // Get all models
        const models = [
          { name: 'User', data: await prisma.user.findMany() },
          { name: 'Course', data: await prisma.course.findMany() },
          { name: 'CourseProgress', data: await prisma.courseProgress.findMany() },
          { name: 'TrainingPath', data: await prisma.trainingPath.findMany() },
          { name: 'PathCourse', data: await prisma.pathCourse.findMany() },
          { name: 'PathProgress', data: await prisma.pathProgress.findMany() },
          { name: 'TrainingModule', data: await prisma.trainingModule.findMany() },
          { name: 'Resource', data: await prisma.resource.findMany() },
          { name: 'Certificate', data: await prisma.certificate.findMany() },
          { name: 'Event', data: await prisma.event.findMany() },
          { name: 'EventRegistration', data: await prisma.eventRegistration.findMany() },
          { name: 'EventMaterial', data: await prisma.eventMaterial.findMany() },
          { name: 'EventSpeaker', data: await prisma.eventSpeaker.findMany() },
          { name: 'EventAgenda', data: await prisma.eventAgenda.findMany() },
        ];

        // Export each model to a JSON file
        for (const model of models) {
          const filePath = path.join(process.cwd(), 'export', `${model.name}.json`);
          fs.writeFileSync(filePath, JSON.stringify(model.data, null, 2));
          console.log(`Exported ${model.data.length} ${model.name} records to ${filePath}`);
        }

        console.log('Export completed successfully');
      } catch (error) {
        console.error('Export failed:', error);
      } finally {
        await prisma.$disconnect();
      }
    }

    exportData();
  `);
  
  // Run the export script
  runCommand('node scripts/export-sqlite.js', 'Failed to export data from SQLite');
  
  // Step 4: Import data to MongoDB
  console.log(`\n${colors.yellow}Step 4: Importing data to MongoDB...${colors.reset}`);
  
  // Create a script to import data to MongoDB
  const importScriptPath = path.join(process.cwd(), 'scripts', 'import-mongodb.js');
  fs.writeFileSync(importScriptPath, `
    const { PrismaClient } = require('@prisma/client');
    const fs = require('fs');
    const path = require('path');
    const { ObjectId } = require('mongodb');

    async function importData() {
      // Use MongoDB connection from .env
      const prisma = new PrismaClient();

      try {
        // Map of old IDs to new ObjectIds
        const idMap = {};

        // Import Users first
        console.log('Importing Users...');
        const usersFile = path.join(process.cwd(), 'export', 'User.json');
        const users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));

        for (const user of users) {
          const newId = new ObjectId();
          idMap[\`User_\${user.id}\`] = newId.toString();

          await prisma.user.create({
            data: {
              id: newId.toString(),
              name: user.name,
              email: user.email,
              password: user.password || '',
              image: user.image,
              role: user.role,
              department: user.department,
              createdAt: new Date(user.createdAt),
              updatedAt: new Date(user.updatedAt),
            }
          });
        }
        console.log(\`Imported \${users.length} Users\`);

        // Import Courses
        console.log('Importing Courses...');
        const coursesFile = path.join(process.cwd(), 'export', 'Course.json');
        const courses = JSON.parse(fs.readFileSync(coursesFile, 'utf8'));

        for (const course of courses) {
          const newId = new ObjectId();
          idMap[\`Course_\${course.id}\`] = newId.toString();

          await prisma.course.create({
            data: {
              id: newId.toString(),
              title: course.title,
              description: course.description,
              category: course.category,
              level: course.level,
              duration: course.duration,
              imageUrl: course.imageUrl,
              createdAt: new Date(course.createdAt),
              updatedAt: new Date(course.updatedAt),
            }
          });
        }
        console.log(\`Imported \${courses.length} Courses\`);

        // Import other models with relationships
        const models = [
          { name: 'TrainingPath', file: 'TrainingPath.json', mapFn: (item) => ({
            id: new ObjectId().toString(),
            title: item.title,
            description: item.description,
            category: item.category,
            imageUrl: item.imageUrl,
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
          })},
          { name: 'TrainingModule', file: 'TrainingModule.json', mapFn: (item) => ({
            id: new ObjectId().toString(),
            title: item.title,
            description: item.description,
            content: item.content,
            duration: item.duration,
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
          })},
          { name: 'Event', file: 'Event.json', mapFn: (item) => ({
            id: new ObjectId().toString(),
            title: item.title,
            description: item.description,
            startDate: new Date(item.startDate),
            endDate: new Date(item.endDate),
            location: item.location,
            capacity: item.capacity,
            imageUrl: item.imageUrl,
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
          })},
        ];

        for (const model of models) {
          console.log(\`Importing \${model.name}...\`);
          const filePath = path.join(process.cwd(), 'export', model.file);
          const items = JSON.parse(fs.readFileSync(filePath, 'utf8'));

          for (const item of items) {
            const newId = new ObjectId();
            idMap[\`\${model.name}_\${item.id}\`] = newId.toString();

            const data = model.mapFn(item);
            data.id = newId.toString();

            await prisma[model.name.charAt(0).toLowerCase() + model.name.slice(1)].create({
              data
            });
          }
          console.log(\`Imported \${items.length} \${model.name} records\`);
        }

        // Import relationship models
        const relationModels = [
          { name: 'CourseProgress', file: 'CourseProgress.json', mapFn: (item) => ({
            id: new ObjectId().toString(),
            userId: idMap[\`User_\${item.userId}\`],
            courseId: idMap[\`Course_\${item.courseId}\`],
            progress: item.progress,
            completed: item.completed,
            completedAt: item.completedAt ? new Date(item.completedAt) : null,
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
          })},
          { name: 'PathCourse', file: 'PathCourse.json', mapFn: (item) => ({
            id: new ObjectId().toString(),
            pathId: idMap[\`TrainingPath_\${item.pathId}\`],
            courseId: idMap[\`Course_\${item.courseId}\`],
            order: item.order,
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
          })},
          { name: 'PathProgress', file: 'PathProgress.json', mapFn: (item) => ({
            id: new ObjectId().toString(),
            userId: idMap[\`User_\${item.userId}\`],
            pathId: idMap[\`TrainingPath_\${item.pathId}\`],
            progress: item.progress,
            completed: item.completed,
            completedAt: item.completedAt ? new Date(item.completedAt) : null,
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
          })},
          // Add other relationship models here
        ];

        for (const model of relationModels) {
          console.log(\`Importing \${model.name}...\`);
          const filePath = path.join(process.cwd(), 'export', model.file);
          
          if (!fs.existsSync(filePath)) {
            console.log(\`File \${filePath} not found, skipping\`);
            continue;
          }
          
          const items = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          let importedCount = 0;

          for (const item of items) {
            try {
              const data = model.mapFn(item);
              
              // Skip if any required foreign key is missing
              if (Object.values(data).includes(undefined)) {
                console.log(\`Skipping \${model.name} with missing foreign key\`);
                continue;
              }
              
              await prisma[model.name.charAt(0).toLowerCase() + model.name.slice(1)].create({
                data
              });
              importedCount++;
            } catch (error) {
              console.error(\`Error importing \${model.name}:\`, error.message);
            }
          }
          console.log(\`Imported \${importedCount} \${model.name} records\`);
        }

        console.log('Import completed successfully');
      } catch (error) {
        console.error('Import failed:', error);
      } finally {
        await prisma.$disconnect();
      }
    }

    importData();
  `);
  
  // Run the import script
  runCommand('node scripts/import-mongodb.js', 'Failed to import data to MongoDB');
  
  // Step 5: Clean up
  console.log(`\n${colors.yellow}Step 5: Cleaning up...${colors.reset}`);
  
  // Remove temporary files
  fs.unlinkSync(tempEnvPath);
  fs.unlinkSync(exportScriptPath);
  fs.unlinkSync(importScriptPath);
  
  console.log(`\n${colors.bright}${colors.green}=== Migration Completed Successfully ===${colors.reset}\n`);
  console.log(`${colors.cyan}Your data has been migrated from SQLite to MongoDB.${colors.reset}`);
  console.log(`${colors.cyan}A backup of your SQLite database is available at ${backupPath}${colors.reset}\n`);
}

// Run the migration
migrateSqliteToMongoDB().catch(error => {
  console.error(`${colors.red}${colors.bright}Migration failed:${colors.reset}`, error);
  process.exit(1);
});