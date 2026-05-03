// import mongoose from 'mongoose';

// const connectDB = async () => {
//   // If we are already connected, don't connect again
//   if (mongoose.connection.readyState >= 1) {
//     return;
//   }
  
//   try {
//     // Connect using the secret string in your .env file
//     await mongoose.connect(process.env.MONGODB_URI);
//     console.log("MongoDB Connected!");
//   } catch (error) {
//     console.error("MongoDB Connection Error: ", error);
//   }
// };

// export default connectDB;