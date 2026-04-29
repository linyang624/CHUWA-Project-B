import dotenv from "dotenv";
import crypto from "crypto";
import connectDB from "./config/db.js";
import RegistrationToken from "./models/RegistrationToken.js";

dotenv.config();
await connectDB();

const token = "test-token";

await RegistrationToken.findOneAndUpdate(
  { token },
  {
    email: "test.employee@example.com",
    firstName: "Test",
    lastName: "Employee",
    token,
    registrationLink: `http://localhost:5173/register/${token}`,
    expiresAt: new Date(Date.now() + 3 * 60 * 60 * 1000),
    used: false,
  },
  { upsert: true, new: true }
);

console.log("Registration token created:");
console.log(`http://localhost:5173/register/${token}`);

process.exit();