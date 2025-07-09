# MongoDB Migration Guide

This guide provides instructions for migrating the Tata Steel Learning Management System from SQLite to MongoDB.

## Prerequisites

- MongoDB installed and running (local or Atlas)
- Node.js and npm installed
- Updated `.env` file with MongoDB connection string

For detailed MongoDB setup instructions, please refer to the [MongoDB Setup Guide](./MONGODB_SETUP_GUIDE.md).

## Migration Steps

### 1. Update Environment Variables

Update your `.env` file to include the MongoDB connection string:

```
DATABASE_URL="mongodb://username:password@localhost:27017/tata-steel-lms?authSource=admin"
```

For MongoDB Atlas, use a connection string like:

```
DATABASE_URL="mongodb+srv://username:password@cluster0.mongodb.net/tata-steel-lms?retryWrites=true&w=majority"
```

### 2. Install Dependencies

Run the following command to install the required dependencies:

```bash
npm install
```

### 3. Migrate Existing Data (Optional)

If you have existing data in SQLite that you want to migrate to MongoDB, run:

```bash
npm run migrate:sqlite-to-mongodb
```

This script will:
- Create a backup of your SQLite database
- Export data from SQLite to JSON files
- Import the data into MongoDB with proper ID conversions
- Clean up temporary files

### 4. Run the MongoDB Setup Script

If you're setting up a new MongoDB database without migrating data, run:

```bash
npm run setup:mongodb
```

This script will:
- Generate the Prisma client
- Push the schema to MongoDB
- Seed the database with initial data

### 4. Authentication Changes

The system now supports two authentication methods:

1. **NextAuth.js** - For web application users
2. **JWT Token** - For API access

API endpoints can be accessed using a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

You can obtain a JWT token by using the `/api/auth/login` endpoint.

### 5. API Endpoints

The following new API endpoints have been added:

- **POST /api/auth/register** - Register a new user
- **POST /api/auth/login** - Login and get a JWT token
- **GET /api/auth/me** - Get the current user's profile
- **GET /api/reports** - Get analytics data (admin/manager only)

### 6. Testing

After migration, test the application thoroughly to ensure all features work correctly with MongoDB.

## Troubleshooting

### Connection Issues

If you encounter connection issues:

1. Verify your MongoDB instance is running
2. Check the connection string in your `.env` file
3. Ensure network connectivity to your MongoDB server
4. Check MongoDB user permissions

### Schema Issues

If you encounter schema-related errors:

1. Check the Prisma schema file for any inconsistencies
2. Run `npx prisma db push --force-reset` to reset and recreate the schema (warning: this will delete all data)

For detailed troubleshooting steps, please refer to the [MongoDB Troubleshooting Guide](./MONGODB_TROUBLESHOOTING.md).

## Rollback Plan

To rollback to SQLite:

1. Restore the original `.env` file with SQLite connection string
2. Restore the original Prisma schema
3. Run `npx prisma migrate reset` to reset the SQLite database
4. Run `npx prisma db seed` to seed the SQLite database

## Support

For any issues or questions, please contact the development team.