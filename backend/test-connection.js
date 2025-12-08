/**
 * Test MongoDB Atlas connection
 * Usage: node test-connection.js "mongodb+srv://..."
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testConnection = async () => {
  const connectionString = process.argv[2] || process.env.MONGODB_URI;

  if (!connectionString) {
    console.error('❌ Please provide connection string:');
    console.error('   node test-connection.js "mongodb+srv://..."');
    console.error('   OR set MONGODB_URI in .env file');
    process.exit(1);
  }

  console.log('Testing MongoDB connection...');
  console.log('Connection string:', connectionString.replace(/:[^:@]+@/, ':****@'));

  try {
    await mongoose.connect(connectionString, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log('✅ Connection successful!');
    console.log('Host:', mongoose.connection.host);
    console.log('Database:', mongoose.connection.name);
    
    // Test a simple query
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name).join(', '));

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    if (error.message.includes('authentication failed')) {
      console.error('\n💡 Authentication Error Tips:');
      console.error('1. Check username and password in connection string');
      console.error('2. URL-encode special characters in password (@ → %40, # → %23, etc.)');
      console.error('3. Verify database user has "Read and write" permissions');
      console.error('4. Ensure connection string includes database name: /retail_sales');
    } else if (error.message.includes('ENOTFOUND')) {
      console.error('\n💡 Network Error Tips:');
      console.error('1. Check MongoDB Atlas Network Access (add 0.0.0.0/0 for testing)');
      console.error('2. Verify cluster is running (not paused)');
      console.error('3. Check connection string hostname is correct');
    }
    
    process.exit(1);
  }
};

testConnection();


