const roomModel = require('../models/rooms');
const { getUser } = require('./auth');

async function getRooms(req, res){
    const token = req.cookies.uid;
    const user = getUser(token);
    if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try{
        const rooms = await roomModel.find({members: user.username});
        return res.status(200).json({rooms});
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message: "Server error: Could not fetch rooms"});
    }
    
}

module.exports = {getRooms};