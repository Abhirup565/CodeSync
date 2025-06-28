const roomModel = require('../models/rooms');

async function deleteRoom(req, res){
    const {roomId, username} = req.body;
    try{
        const room = await roomModel.findOneAndUpdate(
            {room_id: roomId},
            {$pull: {members: username}},
            {new: true}
        );
        if(!room){
            return res.status(404).json({message: "Room not found"});
        }

        //If members array is empty after removal, delete the room
        if(room.members.length === 0){
            await roomModel.deleteOne({room_id: roomId});
        }
        return res.status(200).json({message: `Room deleted: ${room.room_title}`});
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message: "Server error: Couldn't delete room"});
    }
}

module.exports = {deleteRoom};