const express = require('express');
const http = require('http');
const cookieParser = require('cookie-parser');
const {connectDB} = require('./connectMongoDB');
const authRoutes = require('./routes/authRoutes');
const roomRoutes = require('./routes/roomRoutes');
const {Server} = require('socket.io');
const cors = require('cors');

const app = express();
const port = 7500;

const server = http.createServer(app);

//setting up websocket server
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        credentials: true
    }
});
// Import and use your socket handlers
require('./socket')(io);

//Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

//Connect mongoDB
connectDB('mongodb://localhost:27017/CodeSync');

//Routes
app.use("/auth", authRoutes);
app.use("/room", roomRoutes);

server.listen(port, ()=>{
    console.log(`server started at port ${port}`);
});