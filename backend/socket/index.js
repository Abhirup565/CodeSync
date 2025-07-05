const chatEvent = require("./chatEvent");
const codeRunEvent = require("./codeRunEvent");
const joinEvent = require("./joinEvent");

module.exports = function(io){
    io.on('connection', (socket)=>{

        joinEvent(io, socket);
        chatEvent(io, socket);
        codeRunEvent(io, socket);

    })
}