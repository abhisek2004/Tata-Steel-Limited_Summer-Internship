# MongoDB Troubleshooting Guide

## Connection Issues

If you're experiencing issues connecting to MongoDB, follow these troubleshooting steps:

### 1. Verify MongoDB Connection String

Check your `.env` file to ensure your MongoDB connection string is correctly formatted:

```
DATABASE_URL="mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority"
```

Make sure:
- Username and password are correct
- Cluster name is correct
- Database name is specified
- Special characters in username/password are properly URL-encoded

### 2. Check Connection String Format

Run the connection string check script:

```bash
npm run check:connection-string
```

This will:
- Parse your MongoDB connection string
- Validate its components (host, database, credentials)
- Identify if you're using MongoDB Atlas or a standard MongoDB instance
- Highlight any issues with the connection string format

### 3. Check Network Connectivity

Run the connectivity check script:

```bash
npm run check:atlas-connectivity
```

This will verify if:
- DNS resolution for the MongoDB Atlas domain is working
- Your network can reach the MongoDB Atlas service

### 4. Generate Prisma Client Only

If you're having issues with the full MongoDB setup, try generating just the Prisma client:

```bash
npm run generate:client
```

### 5. Common Issues and Solutions

#### Network Restrictions

- **IP Whitelist**: Ensure your current IP address is whitelisted in MongoDB Atlas
- **Firewall Issues**: Check if your firewall is blocking outgoing connections to MongoDB Atlas
- **VPN Interference**: If using a VPN, try connecting without it

#### Authentication Problems

- **Invalid Credentials**: Double-check username and password
- **Auth Database**: Make sure you're using the correct authentication database
- **User Permissions**: Verify the user has appropriate permissions for the database

#### MongoDB Atlas Specific

- **Cluster Status**: Check if your MongoDB Atlas cluster is running
- **Free Tier Limitations**: Be aware of connection limitations on free tier clusters
- **Idle Timeout**: Free tier clusters may sleep after periods of inactivity

### 6. Alternative Connection Options

#### Use the Database Switching Utility

The project includes a utility to easily switch between MongoDB and SQLite:

```bash
npm run switch:database
```

This interactive utility will:
1. Show your current database configuration
2. Allow you to switch between MongoDB and SQLite
3. Update your `.env` file automatically
4. Optionally set up the database after switching

#### Use SQLite for Development

If you're still having issues with MongoDB, you can use SQLite for development:

1. Update your `.env` file:
   ```
   DATABASE_URL="file:./dev.db"
   ```

2. Run Prisma commands for SQLite:
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

#### Local MongoDB Instance

Alternatively, you can run MongoDB locally:

1. Install MongoDB Community Edition
2. Update your `.env` file:
   ```
   DATABASE_URL="mongodb://localhost:27017/tata-steel-learning"
   ```

### 7. Check MongoDB Utilities

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

### 8. Getting Help

If you're still experiencing issues:

- Check the [MongoDB Atlas documentation](https://docs.atlas.mongodb.com/)
- Review the [Prisma documentation](https://www.prisma.io/docs/)
- Consult the [MongoDB Community Forums](https://www.mongodb.com/community/forums/)