module.exports = (io, socket)=>{
    socket.on('join-room', ({roomId, username})=>{
        socket.join(roomId);
        socket.username = username;
        socket.roomId = roomId;

        //Notify all other users in the room
        socket.to(roomId).emit('presence-update', {
            username,
            type: "joined"
        });

        //get all the online users for the newly joined user
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
    })
}