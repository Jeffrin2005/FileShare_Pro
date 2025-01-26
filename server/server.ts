import express from "express";
import connectDB from "./config/db";
import dotenv from "dotenv";
import fileRoute from "./routes/files";
import downloadRoute from "./routes/download";
import cors from "cors";
import path from "path";

dotenv.config();
const app = express();

// Configure CORS
app.use(cors({
  origin: 'http://localhost:3000', // Next.js client runs on 3000
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Content-Length']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!require('fs').existsSync(uploadsDir)) {
  require('fs').mkdirSync(uploadsDir);
}

// Set base directory
const globalAny: any = global;
globalAny.__basedir = __dirname;
console.log('Base directory:', globalAny.__basedir);

const PORT = process.env.PORT || 3000;
connectDB();

app.use("/api/files", fileRoute);
app.use("/api/download", downloadRoute);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
