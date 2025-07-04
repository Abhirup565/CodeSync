const chatEvent = require("./chatEvent");
const codeRunEvent = require("./codeRunEvent");
const deleteRoomEvent = require("./deleteRoomEvent");
const joinEvent = require("./joinEvent");

module.exports = function(io){
    io.on('connection', (socket)=>{

        console.log("user joined")
        joinEvent(io, socket);
        chatEvent(io, socket);
        deleteRoomEvent(io, socket);
        codeRunEvent(io, socket);
        
        socket.on('disconnect', ()=>{
            console.log("user disconnect")
        });
    })
}