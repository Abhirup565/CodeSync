const chatEvent = require("./chatEvent");
const deleteRoomEvent = require("./deleteRoomEvent");
const joinEvent = require("./joinEvent");

module.exports = function(io){
    io.on('connection', (socket)=>{

        joinEvent(io, socket);
        chatEvent(io, socket);
        deleteRoomEvent(io, socket);
        
        socket.on('disconnect', ()=>{});
    })
}