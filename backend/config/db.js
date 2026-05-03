import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://adityasingh01710_db_user:x8rahFxpRiVVC6zd@cluster0.ialaclm.mongodb.net/MediHeal"
    );

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};