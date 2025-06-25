const chatEvent = require("./chatEvent");
const joinEvent = require("./joinEvent");

module.exports = function(io){
    io.on('connection', (socket)=>{
        console.log('A user connected:', socket.id);

        //Put all your events on different files here...
        //example:
        //chatEvent(io, socket);
        joinEvent(io, socket);
        chatEvent(io, socket);
        
        socket.on('disconnect', ()=>{
            console.log('User disconnected:', socket.id);
        });
    })
}