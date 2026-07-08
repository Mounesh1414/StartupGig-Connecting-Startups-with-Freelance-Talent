import mongoose from "mongoose";

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      "MONGODB_URI is not defined. Create server/.env (copy server/.env.example) and set MONGODB_URI, then restart the server."
    );
  }

  await mongoose.connect(uri);
  console.log("MongoDB connected");
};
