import express from "express";
import http from "http";
import { Server } from "socket.io";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";
import quoteRoutes from "./routes/quote.route.js";
import postRoutes from "./routes/post.routes.js";
import { connectDB } from "./lib/db.js";

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5001;

console.log("ENV:", process.env.NODE_ENV);

const allowedOrigins = [
  "http://localhost:5173",
  "https://streamify-two-pied.vercel.app", // your deployed frontend
];

//   CORS for Express API
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

//   Required for cookies in production
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/quotes", quoteRoutes);
app.use("/api/posts", postRoutes);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

// Attach io to app so controllers can use it
app.set("io", io);

// Socket.IO logic
io.on("connection", (socket) => {
  console.log("  New socket connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("  Socket disconnected:", socket.id);
  });
});

// Start Server
server.listen(PORT, () => {
  connectDB();
  console.log(`  Server running on port ${PORT}`);
});
