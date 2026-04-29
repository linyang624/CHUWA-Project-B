import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import connectDB from './config/db.js';

import errorHandler from './middlewares/errorHandler.js';

import authRoutes from "./routes/authRoutes.js";
import onboardingRoutes from "./routes/onboardingRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import registrationRoutes from "./routes/registrationRoutes.js";
import hrRoutes from "./routes/hrRoutes.js";
import visaRoutes from "./routes/visaRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";

// Backend entry point.
// It creates the Express app, connects to MongoDB,
// registers middlewares and routes, then starts the server.

dotenv.config();
connectDB();

const app = express();

app.use(cors());   // Enable CORS so the frontend can call backend APIs.
app.use(express.json()); 


// Routes will be added here later
app.use("/api/auth", authRoutes);
app.use("/api/onboarding", onboardingRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/registration", registrationRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/hr", hrRoutes);
app.use("/api/visa", visaRoutes);
app.use("/api/documents", documentRoutes);

// Error handler must be after all routes
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});