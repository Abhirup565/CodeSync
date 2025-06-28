module.exports = (io, socket)=>{
    socket.on('delete-room',({roomId})=>{
        io.emit('update-members', {roomId, type: "left"});
    });
}