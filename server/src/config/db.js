import mongoose from 'mongoose';

const sanitizeMongoURI = (raw) => {
  let uri = (raw || '').trim();

  // Strip accidental outer quotes if added in Render environment dashboard
  if (
    (uri.startsWith('"') && uri.endsWith('"')) ||
    (uri.startsWith("'") && uri.endsWith("'"))
  ) {
    uri = uri.slice(1, -1).trim();
  }

  // Strip accidental "MONGODB_URI=" prefix if pasted inside the Value box in Render
  if (uri.startsWith('MONGODB_URI=')) {
    uri = uri.replace(/^MONGODB_URI=/, '').trim();
  }

  // Auto-encode '@' or special chars in password if user enters unencoded password
  // Example: mongodb+srv://user:pass@123@cluster0...
  if (uri.includes('://')) {
    const [scheme, rest] = uri.split('://');
    const lastAtIndex = rest.lastIndexOf('@');
    if (lastAtIndex !== -1) {
      const userinfo = rest.substring(0, lastAtIndex);
      const hostPart = rest.substring(lastAtIndex + 1);
      const firstColon = userinfo.indexOf(':');
      if (firstColon !== -1) {
        const username = userinfo.substring(0, firstColon);
        const rawPassword = userinfo.substring(firstColon + 1);
        if (rawPassword.includes('@')) {
          const encodedPassword = encodeURIComponent(decodeURIComponent(rawPassword));
          uri = `${scheme}://${username}:${encodedPassword}@${hostPart}`;
        }
      }
    }
  }

  // Auto-append database name if missing (e.g. ends with .mongodb.net/ or .mongodb.net)
  if (uri.endsWith('.mongodb.net/')) {
    uri = `${uri}smartcare?retryWrites=true&w=majority`;
  } else if (uri.endsWith('.mongodb.net')) {
    uri = `${uri}/smartcare?retryWrites=true&w=majority`;
  }

  return uri;
};

const connectDB = async () => {
  const mongoURI = sanitizeMongoURI(process.env.MONGODB_URI);

  if (!mongoURI) {
    console.error('\n❌ MONGODB_URI environment variable is missing!');
    console.error('👉 In Render dashboard -> Environment tab, add:');
    console.error('   Key: MONGODB_URI');
    console.error('   Value: mongodb+srv://harshitashiny27_db_user:Harshitashiny%40123@cluster0.xduwjg7.mongodb.net/smartcare?retryWrites=true&w=majority\n');
    return null;
  }

  // Validate scheme
  if (!mongoURI.startsWith('mongodb://') && !mongoURI.startsWith('mongodb+srv://')) {
    console.error('\n❌ Invalid MONGODB_URI scheme!');
    console.error(`👉 Received MONGODB_URI starting with: "${mongoURI.substring(0, 20)}..."`);
    console.error('   A valid MongoDB connection string MUST start with:');
    console.error('   "mongodb+srv://" (for MongoDB Atlas cloud) or "mongodb://" (for standalone MongoDB)');
    console.error('   Example: mongodb+srv://harshitashiny27_db_user:Harshitashiny%40123@cluster0.xduwjg7.mongodb.net/smartcare?retryWrites=true&w=majority\n');
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
