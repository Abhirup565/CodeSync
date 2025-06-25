const roomModel = require('../models/rooms');
const { getUser } = require('./auth');

async function createRoom(req, res){
    const {roomTitle, selectedLanguage, generatedRoomId} = req.body;
    const token = req.cookies.uid;
    let user;
    try{
        user = getUser(token);
        if(!user){
            return res.status(401).json({message: "Unauthorized user. Please Login"})
        }
        await roomModel.create({
            room_id: generatedRoomId,
            room_title: roomTitle,
            language: selectedLanguage,
            members: [user.username],
            createdBy: user.username,
            createdAt: new Date()
        });
        return res.status(201).json({message: `Room created: ${roomTitle}`});
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message: "Server error: Failed to create room"});
    }
}

module.exports = {createRoom};