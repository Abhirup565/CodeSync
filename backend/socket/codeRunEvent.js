const axios = require('axios');
const runningRooms = {};

const languageMap = {
    javascript: 63,
    python: 109,
    java: 62,
    cpp: 54,
    c: 50,
    csharp: 51,
    go: 107,
    rust: 108,
    typescript: 101,
    php: 98,
    ruby: 72,
}

const JUDGE0_URL = "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true";
const JUDGE0_HEADERS = {
    "Content-Type": "application/json",
    "x-rapidapi-key": "8ffe0e1b1emshcec62de58239076p18784bjsn1f1acdb0d871",
    "x-rapidapi-host": "judge0-ce.p.rapidapi.com"
};

module.exports = (io, socket) =>{
    socket.on('run-code', async ({roomId, username, code, language})=>{
        if(runningRooms[roomId]) return; //ignore if already running in the room with roomId

        runningRooms[roomId] = true;
        //notify all members in the room that code is running
        socket.to(roomId).emit('code-running', {username});

        try {
            const language_id = languageMap[language] || 63;
            const response = await axios.post(JUDGE0_URL,
                {
                    source_code: code,
                    language_id,
                    stdin: "",
                },
                { headers: JUDGE0_HEADERS}
            );
            
            // Judge0 status info
            const status = response.data.status?.description || "";
            const stderr = response.data.stderr;
            const compile_output = response.data.compile_output;
            const stdout = response.data.stdout;

            let output = "";

            if (status !== "Accepted") {
                output += `Status: ${status}\n`;
            }
            if (compile_output) {
                output += compile_output + "\n";
            }
            if (stderr) {
                output += stderr + "\n";
            }
            if (stdout) {
                output += stdout + "\n";
            }
            if (!output.trim()) {
                output = "No output";
            }
            
            io.in(roomId).emit('code-output', {output});
        } catch (err) {
            io.in(roomId).emit('code-output', { output: "Error running code."});
        }
        setTimeout(() => {
            runningRooms[roomId] = false;
            io.in(roomId).emit('code-stopped');
        }, 1000)
    })
}