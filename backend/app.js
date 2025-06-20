const express = require('express');
const http = require('http');
const cookieParser = require('cookie-parser');
const {connectDB} = require('./connectMongoDB');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');
const app = express();
const port = 7500;

const server = http.createServer(app);

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

server.listen(port, ()=>{
    console.log(`server started at port ${port}`);
});