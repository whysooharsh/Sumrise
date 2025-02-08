const mongoose = require("mongoose");
require("dotenv").config();

if (!process.env.MONGODB_URI) {
  console.error("Error: MONGODB_URI is not defined in the environment variables.");
  process.exit(1);
}

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

// TODO: Add any additional database setup if required

module.exports = connectDB;