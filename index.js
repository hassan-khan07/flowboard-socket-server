import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim());

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
});
app.use(cors({ origin: allowedOrigins }));

app.get("/", (req, res) => {
  res.send("FlowBoard socket server is running");
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  socket.on("task-moved", (data) => {
    socket.broadcast.emit("task-moved", data);
  });
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Socket.io server running on port ${PORT}`);
});