import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import { init } from './db/mongodb.js';

const server = http.createServer(app);
const io = new Server(server);
const PORT = 8080;
let serverSocket;

await init();

io.on("connection", (socket) => {
  console.log("a user connected");
  serverSocket = socket;
  socket.on("newProduct", (product) => {
    console.log("newProduct: ", product);
  });
  socket.on("deleteProduct", (productId) => {
    console.log("deleteProduct: ", productId);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default io;
