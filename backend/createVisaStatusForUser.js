// createVisaStatusForUser.js
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import OnboardingApplication from "./models/OnboardingApplication.js";
import VisaStatus from "./models/VisaStatus.js";
import "./models/Document.js";

dotenv.config();
await connectDB();

const username = "test";

const user = await User.findOne({ username });
if (!user) {
  console.log("User not found");
  process.exit();
}

const app = await OnboardingApplication.findOne({ user: user._id }).populate(
  "workAuthorization.optReceipt"
);

if (!app || app.status !== "approved") {
  console.log("Approved onboarding application not found");
  process.exit();
}

if (app.workAuthorization?.visaTitle !== "f1_cpt_opt") {
  console.log("This user is not F1 CPT/OPT. Visa status page is not required.");
  process.exit();
}

const visaStatus = await VisaStatus.findOneAndUpdate(
  { user: app.user },
  {
    user: app.user,
    visaTitle: "f1_cpt_opt",
    startDate: app.workAuthorization.startDate,
    endDate: app.workAuthorization.endDate,

    currentStep: "opt_receipt",

    optReceipt: app.workAuthorization.optReceipt,
  },
  {
    new: true,
    upsert: true,
  }
);
console.log("Visa status created/updated:", visaStatus);
process.exit();