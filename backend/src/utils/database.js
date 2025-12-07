import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const options = {
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      bufferCommands: false, // Disable mongoose buffering
    };

    const conn = await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/retail_sales',
      options
    );
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });
    
    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    
    // Provide helpful error messages
    if (error.message.includes('authentication failed') || error.message.includes('bad auth')) {
      console.error('\n🔧 Authentication Error - Check:');
      console.error('1. MongoDB Atlas username and password are correct');
      console.error('2. Password is URL-encoded if it contains special characters');
      console.error('3. Database user has proper permissions');
      console.error('4. Connection string format: mongodb+srv://username:password@cluster.../database?options');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      console.error('\n🔧 Network Error - Check:');
      console.error('1. MongoDB Atlas Network Access allows your IP (or 0.0.0.0/0)');
      console.error('2. Cluster is running and not paused');
      console.error('3. Connection string hostname is correct');
    }
    
    process.exit(1);
  }
};

export default connectDB;

