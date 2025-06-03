const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error("Missing MongoDB URI in environment variables");
    }

    const connect = await mongoose.connect(mongoUri);

    console.log(`MongoDB Connected: ${connect.connection.host} , ${connect.connection.name}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1); // Exit on failure
  }
};

module.exports = dbConnect;
