const roomModel = require('../models/rooms');

async function getRoomDetails(req, res){
    const roomId = req.body.roomId;
    try{
        const room = await roomModel.findOne({room_id: roomId});
        if(!room){
            return res.status(404).json({message: "Room not found"})
        }
        return res.status(200).json(room);
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message: "Server error: Could not fetch room details"});
    }
}
module.exports = {getRoomDetails};