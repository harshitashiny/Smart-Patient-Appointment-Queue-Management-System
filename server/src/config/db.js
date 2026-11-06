import mongoose from 'mongoose';

const connectDB = async () => {
  let mongoURI = (process.env.MONGODB_URI || '').trim();

  // Strip accidental outer quotes if added in Render environment dashboard
  if (
    (mongoURI.startsWith('"') && mongoURI.endsWith('"')) ||
    (mongoURI.startsWith("'") && mongoURI.endsWith("'"))
  ) {
    mongoURI = mongoURI.slice(1, -1).trim();
  }

  // Strip accidental "MONGODB_URI=" prefix if pasted inside the Value box in Render
  if (mongoURI.startsWith('MONGODB_URI=')) {
    mongoURI = mongoURI.replace(/^MONGODB_URI=/, '').trim();
  }

  if (!mongoURI) {
    console.error('\n❌ MONGODB_URI environment variable is missing!');
    console.error('👉 In Render dashboard -> Environment tab, add:');
    console.error('   Key: MONGODB_URI');
    console.error('   Value: mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/smartcare?retryWrites=true&w=majority\n');
    return null;
  }

  // Validate scheme
  if (!mongoURI.startsWith('mongodb://') && !mongoURI.startsWith('mongodb+srv://')) {
    console.error('\n❌ Invalid MONGODB_URI scheme!');
    console.error(`👉 Received MONGODB_URI starting with: "${mongoURI.substring(0, 20)}..."`);
    console.error('   A valid MongoDB connection string MUST start with:');
    console.error('   "mongodb+srv://" (for MongoDB Atlas cloud) or "mongodb://" (for standalone MongoDB)');
    console.error('   Example: mongodb+srv://user:pass@cluster0.xyz.mongodb.net/smartcare?retryWrites=true&w=majority\n');
    return null;
  }

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('👉 If using MongoDB Atlas, make sure you added 0.0.0.0/0 under Network Access.');
    return null;
  }
};

export default connectDB;
