import mongoose from 'mongoose';

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    console.error('\n❌ MONGODB_URI environment variable is not defined!');
    console.error('👉 For Render deployment: Please add MONGODB_URI in the Render dashboard "Environment" tab (e.g., your MongoDB Atlas connection string).\n');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(mongoURI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
