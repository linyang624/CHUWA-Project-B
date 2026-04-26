import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import connectDB from './config/db.js';

import errorHandler from './middlewares/errorHandler.js';
import hrRoutes from "./routes/hrRoutes.js";
import visaRoutes from "./routes/visaRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());


// Routes 
app.use("/api/hr", hrRoutes);
app.use("/api/visa", visaRoutes);
app.use("/api/documents", documentRoutes);

// Error handler must be after all routes
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});