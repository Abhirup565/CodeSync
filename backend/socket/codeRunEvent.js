const axios = require('axios');
const {Buffer} = require('buffer');
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

const JUDGE0_URL = "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=true";
const JUDGE0_HEADERS = {
    "Content-Type": "application/json",
    "x-rapidapi-key": "8ffe0e1b1emshcec62de58239076p18784bjsn1f1acdb0d871",
    "x-rapidapi-host": "judge0-ce.p.rapidapi.com"
};
function decodeBase64(str) {
    if (!str) return "";
    return Buffer.from(str, 'base64').toString('utf-8');
}

module.exports = (io, socket) =>{
    socket.on('run-code', async ({roomId, username, code, language})=>{
        if(runningRooms[roomId]) return; //ignore if already running in the room with roomId

        runningRooms[roomId] = true;
        //notify all members in the room that code is running
        socket.to(roomId).emit('code-running', {username});

        try {
            const language_id = languageMap[language] || 63;
            const source_code = Buffer.from(code, 'utf-8').toString('base64');
            const response = await axios.post(JUDGE0_URL,
                {
                    source_code,
                    language_id,
                    stdin: "",
                },
                { headers: JUDGE0_HEADERS}
            );
            
            // Judge0 status info
            const status = response.data.status?.description || "";
            const stderr = decodeBase64(response.data.stderr);
            const compile_output = decodeBase64(response.data.compile_output);
            const stdout = decodeBase64(response.data.stdout);

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
            console.log(err);
            //check for judge0 limit error (HTTP 429)
            if(err.response && err.response.status === 429){
                io.in(roomId).emit('judge0-limit-reached',{
                    message: "Code running limit reached. Code cannot be run anymore today."
                });
            }
            else if (err.response && err.response.data) {
                const data = err.response.data;
                let output = "";
                if (data.status && data.status.description) {
                    output += `Status: ${data.status.description}\n`;
                }
                if (data.compile_output) {
                    output += data.compile_output + "\n";
                }
                if (data.stderr) {
                    output += data.stderr + "\n";
                }
                if (data.stdout) {
                    output += data.stdout + "\n";
                }
                if (!output.trim()) {
                    output = "No output";
                }
                io.in(roomId).emit('code-output', { output });
            }
            else{
                io.in(roomId).emit('code-output', { output: "Error running code."});
            }
        }
        setTimeout(() => {
            runningRooms[roomId] = false;
            io.in(roomId).emit('code-stopped');
        }, 1000);
    })
}