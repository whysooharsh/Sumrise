require("dotenv").config();
const mongoose = require("mongoose");

if (!process.env.MONGODB_URI) {
  console.error("Error: MONGODB_URI is not defined in the environment variables.");
  process.exit(1);
}

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

module.exports = connectDB;