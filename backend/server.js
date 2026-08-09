import express from 'express'
import cors from 'cors'
import { connectDB } from './config/db.js'
import userRouter from './routes/userRouter.js'
import aiRouter from "./routes/aiRouter.js"
import resumeRouter from "./routes/resumeRouter.js"
import cookieParser from "cookie-parser"
import path from "path"
import { fileURLToPath } from "url"
import extensionRoutes from "./routes/extensionRoutes.js";
import dotenv from 'dotenv'
dotenv.config();

const app = express()
const PORT = process.env.PORT || 4000

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

const allowedOrigins = [
    "http://localhost:5000",      // Website
    "http://localhost:5173"       // Vite (if used)
];

const corsOptions = {

    origin(origin, callback) {
        // Allow Postman/server-to-server requests
        if (!origin)
            return callback(null, true);

        // Allow any localhost origin (handles 5173, 5174, etc.)
        if (origin.startsWith("http://localhost"))
            return callback(null, true);

        // Allow any Chrome extension
        if (origin.startsWith("chrome-extension://"))
            return callback(null, true);

        callback(new Error("Not allowed by CORS"));
    },

    credentials: true,

    methods: ["GET", "POST", "PUT", "DELETE"],

    allowedHeaders: [

        "Content-Type",

        "Authorization"

    ]

};

app.use(cors(corsOptions));

app.use(cors(corsOptions));

// Connect to MongoDB
connectDB()

// API Endpoints
app.use('/api/users', userRouter)
app.use("/api/ai", aiRouter)
app.use("/api/resume", resumeRouter)
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

app.use("/api/extension", extensionRoutes);

app.get('/', (req, res) => {
  res.send("API Working")
})

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`)
})
