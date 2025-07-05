const roomModel = require('../models/rooms');

module.exports = (io, socket)=>{
    socket.on('join-room', async ({roomId, username})=>{
        socket.join(roomId);
        socket.username = username;
        socket.roomId = roomId;

        const room = await roomModel.findOne({room_id: roomId});
        const count = room ? room.members.length : 0;

        io.emit('update-members', {roomId, count});

        //Notify all other users in the room
        socket.to(roomId).emit('presence-update', {
            username,
            type: "joined"
        });

        //send all the online users for the newly joined user
        io.in(roomId).fetchSockets().then(sockets => {
            const onlineUsers = sockets.map(s => s.username);

            socket.emit('online-users', onlineUsers); //just emit to the newly joined user
        }) 
    });

    //disconnect event
    socket.on('disconnect', ()=>{
        const roomId = socket.roomId;

        socket.to(roomId).emit('presence-update', {
            username: socket.username,
            type: "left"
        });
    });

    //Handle delete-room event
    socket.on('delete-room', async ({roomId}) =>{
        const room = await roomModel.findOne({room_id: roomId});
        const count = room ? room.members.length : 0;
        io.emit('update-members', {roomId, count});
    });
}