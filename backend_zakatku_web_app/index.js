require("dotenv").config();
const express = require("express");
const port = process.env.PORT;
const router = require("./routes");
const { sequelize } = require("./models");
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler");
const path = require("path");

const app = express();

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Konfigurasi CORS
// Allowed origins
const allowedOrigins = ["https://zakatku-web-app.vercel.app", "http://localhost:5173"];

// CORS configuration
// Logging origin (debug)
app.use((req, res, next) => {
  console.log("Incoming request from:", req.headers.origin);
  next();
});

// CORS setup
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 200,
  }),
);

// Handle preflight request
// app.options("*", cors());

// Routes
app.use("/api", router);

// Root endpoint
app.get("/", (req, res) => {
  res.send("Hello World!, I'm backend from Zakatku Web App");
});

// Handle CORS error gracefully
app.use((err, req, res, next) => {
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({ message: "CORS policy violation" });
  }
  next(err);
});

// Global error handler
app.use(errorHandler);

// Server start
app.listen(port, async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully.");
    console.log(`🚀 Server running on port ${port}`);
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
});
