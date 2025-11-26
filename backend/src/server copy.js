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
const server = http.createServer(app); // ✅ Create HTTP server
const PORT = process.env.PORT || 5001;

// ✅ Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // your frontend URL
    credentials: true,
  },
});

// ✅ Setup CORS, middleware, etc.
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/quotes", quoteRoutes);
app.use("/api/posts", postRoutes);

// ✅ Attach io instance to app (so controllers can emit)
app.set("io", io);

// ✅ Socket.IO logic
io.on("connection", (socket) => {
  console.log("🟢 New socket connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected:", socket.id);
  });
});

// ✅ Start Server + Connect DB
server.listen(PORT, () => {
  connectDB();
  console.log(`🚀 Server is running on port ${PORT}`);
});
