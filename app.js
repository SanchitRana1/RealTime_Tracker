import express from "express";
import http from "http";
import path from "path";
import { fileURLToPath } from 'url';
import {Server} from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

io.on("connection",(socket)=>{
  // accepting send-location event emitted from frontend
  socket.on("send-location",(data)=>{
    io.emit("receive-location",{id:socket?.id,...data})
  })

  //handling disconnect
  socket.on("disconnect",()=>{
    io.emit("user-disconnected",socket?.id)
  })
    // console.log("connected");
})


app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname,"public")))
app.get("/", (req, res) => {
    res.render("index")
});

server.listen(5000, () => {
  console.log("listening to post 5000");
});
