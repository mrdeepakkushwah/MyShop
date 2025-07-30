const mongoose = require("mongoose");

const dbConnect = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.error("❌ Missing MongoDB URI in environment variables.");
    process.exit(1);
  }

  try {
    const connection = await mongoose.connect(mongoUri); // ⬅️ no extra options needed
    console.log(
      `✅ MongoDB connected: ${connection.connection.host} / ${connection.connection.name}`
    );
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = dbConnect;
