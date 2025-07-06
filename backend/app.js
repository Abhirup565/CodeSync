require('dotenv').config();
const express = require('express');
const http = require('http');
const cookieParser = require('cookie-parser');
const {connectDB} = require('./connectMongoDB');
const authRoutes = require('./routes/authRoutes');
const roomRoutes = require('./routes/roomRoutes');
const editorRoutes = require('./routes/editorRoutes');
const {Server: SocketIoServer} = require('socket.io');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 7500;

const server = http.createServer(app);

//setting up websocket server
const io = new SocketIoServer(server, {
    cors: {
        origin: 'https://codesync-six-gules.vercel.app/',
        credentials: true
    }
});
// Import and use your socket handlers
require('./socket')(io);

//Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'https://codesync-six-gules.vercel.app/',
    credentials: true
}));

//Connect mongoDB
connectDB(process.env.MONGODB_URI);

//Routes
app.use("/auth", authRoutes);
app.use("/room", roomRoutes);
app.use("/code", editorRoutes);

app.get('/',(req, res)=>{
    res.send("server is running.");
});

server.listen(port, ()=>{
    console.log(`server started at port ${port}`);
});