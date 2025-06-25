module.exports = (io, socket)=>{
    socket.on('send-message',({roomId, sender, message})=>{

        //send message to roomId except for the sender
        socket.to(roomId).emit('receive-message', {sender, message});
    });
}