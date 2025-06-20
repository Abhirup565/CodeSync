const mongoose = require('mongoose');

function connectDB(url){
    try{
        mongoose.connect(url);
        console.log("mongodb connected");
    }
    catch(e){
        console.log("Error connecting to mongodb", e);
    }
}
module.exports = {connectDB};