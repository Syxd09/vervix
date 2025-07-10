import mongoose from "mongoose";

const connectDB = async () => {
  mongoose.connection.on("connected", () => {
    console.log("DB Connected:", mongoose.connection.name);
  });

  await mongoose.connect(
    process.env.MONGODB_URI ||
      "mongodb+srv://vervixco:7619365978@vervix.o0n2svm.mongodb.net/ecommerce"
  );
};

export default connectDB;
