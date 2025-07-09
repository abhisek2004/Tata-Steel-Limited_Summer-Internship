# MongoDB Setup Guide

This guide provides detailed instructions for setting up and configuring MongoDB for this project.

## Prerequisites

1. **MongoDB Atlas Account**
   - Sign up for a free MongoDB Atlas account at [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new cluster (the free tier is sufficient for development)

2. **Node.js and npm**
   - Make sure you have Node.js and npm installed

## Setup Steps

### 1. Get Your MongoDB Connection String

1. In MongoDB Atlas, click on "Connect" for your cluster
2. Select "Connect your application"
3. Choose "Node.js" as your driver and copy the connection string
4. Replace `<password>` with your database user's password
5. Replace `<dbname>` with `tata-steel-learning`

Example connection string:
```
mongodb+srv://username:password@cluster0.mongodb.net/tata-steel-learning?retryWrites=true&w=majority
```

### 2. Configure Environment Variables

Update your `.env` file with the MongoDB connection string:

```
DATABASE_URL="your-mongodb-connection-string"
```

### 3. Verify Connection String

Run the connection string check script to validate your MongoDB URL:

```bash
npm run check:connection-string
```

This will:
- Parse your MongoDB connection string
- Validate its components (host, database, credentials)
- Identify if you're using MongoDB Atlas or a standard MongoDB instance
- Highlight any issues with the connection string format

### 4. Check Network Connectivity

Verify that your network can reach MongoDB Atlas:

```bash
npm run check:atlas-connectivity
```

This will check:
- DNS resolution for the MongoDB Atlas domain
- Network connectivity to MongoDB Atlas services

### 5. Generate Prisma Client

Generate the Prisma client for MongoDB:

```bash
npm run generate:client
```

### 6. Set Up MongoDB Database

Run the MongoDB setup script to initialize your database:

```bash
npm run setup:mongodb
```

This script will:
- Generate the Prisma client
- Push the schema to MongoDB
- Seed the database with initial data

### 7. Migrate Data (Optional)

If you have existing data in SQLite that you want to migrate to MongoDB:

```bash
npm run migrate:sqlite-to-mongodb
```

## Troubleshooting

### Verify Installation

You can verify that all MongoDB-related utilities and configurations are properly installed:

```bash
npm run check:mongodb-utilities
```

This will check:
- Required scripts in package.json
- Utility scripts existence
- Documentation files
- Environment variables
- Prisma schema configuration
- Required npm packages

### Troubleshooting Guide

If you encounter issues during setup, please refer to the [MongoDB Troubleshooting Guide](./MONGODB_TROUBLESHOOTING.md) for detailed solutions.

### Common Issues

1. **Connection Errors**
   - Verify your MongoDB Atlas username and password
   - Check if your IP address is whitelisted in MongoDB Atlas
   - Ensure your network allows outbound connections to MongoDB Atlas

2. **Authentication Errors**
   - Confirm that your database user has the correct permissions
   - Check for special characters in your password that might need URL encoding

3. **Schema Errors**
   - Ensure your Prisma schema is compatible with MongoDB
   - Run `npx prisma generate` after any schema changes

## Switching Between Databases

You can easily switch between MongoDB and SQLite using the database switching utility:

```bash
npm run switch:database
```

This interactive utility will:
1. Show your current database configuration
2. Allow you to switch between MongoDB and SQLite
3. Update your `.env` file automatically
4. Optionally set up the database after switching

## Monitoring and Management

### Prisma Studio

You can use Prisma Studio to view and manage your MongoDB data:

```bash
npm run prisma:studio
```

### MongoDB Atlas Dashboard

The MongoDB Atlas dashboard provides monitoring and management tools for your database:

1. Log in to [MongoDB Atlas](https://cloud.mongodb.com)
2. Select your cluster
3. Use the various tabs to monitor performance, manage data, and configure settings

## Additional Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Prisma with MongoDB Documentation](https://www.prisma.io/docs/concepts/database-connectors/mongodb)
- [MongoDB Node.js Driver Documentation](https://docs.mongodb.com/drivers/node/)