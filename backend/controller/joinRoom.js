const roomModel = require('../models/rooms');
const { getUser } = require('./auth');

async function joinRoom(req, res){
    const token = req.cookies.uid;
    const roomId = req.body.roomId;

    const user = getUser(token);
    if(!user){
        return res.status(401).json({message: "Unauthorized user. Please login"});
    }
    try{
        const room = await roomModel.findOne({room_id: roomId});
        if(!room){
            return res.status(404).json({message: "Invalid Room ID or the room doesn't exist"});
        }
        await roomModel.updateOne(
            {room_id: roomId},
            {$addToSet: {members: user.username}} //add to members array only if username doesn't exist
        );
        return res.status(200).json({message: `Joined room: ${room.room_title}`});
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message: "Server error: Could not join room"});
    }
}
module.exports = {joinRoom};