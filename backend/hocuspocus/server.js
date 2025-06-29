const { Server } = require('@hocuspocus/server');

const server = new Server({
    port: 1234
});

server.listen().then(()=>{
    console.log("Hocuspocus server running at ws://localhost:1234")
});