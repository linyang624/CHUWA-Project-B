import dotenv from "dotenv";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import OnboardingApplication from "./models/OnboardingApplication.js";

dotenv.config();
await connectDB();

const username = "test";

const user = await User.findOne({ username });

if (!user) {
  console.log("User not found");
  process.exit();
}

const app = await OnboardingApplication.findOneAndUpdate(
  { user: user._id },
  { status: "approved" },
  { new: true }
);

console.log("Updated application:", app);
process.exit();