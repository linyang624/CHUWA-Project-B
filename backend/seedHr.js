import dotenv from "dotenv";
import connectDB from "./config/db.js";
import User from "./models/User.js";

dotenv.config();

const seedHr = async () => {
  try {
    await connectDB();

    await User.deleteMany({
      $or: [{ username: "hr" }, { email: "hr@chuwa.com" }],
    });

    await User.create({
      username: "hr",
      email: "hr@chuwa.com",
      password: "hr123456",
      role: "hr",
    });

    console.log("HR account created successfully.");
    console.log("username: hr");
    console.log("password: hr123456");

    process.exit(0);
  } catch (error) {
    console.error("Seed HR failed:", error.message);
    process.exit(1);
  }
};

seedHr();