const editorModel = require('../models/editor');

async function saveCode(req, res){
    const {roomId, code} = req.body;
    if(!roomId || typeof code !== "string"){
        return res.status(400).json({message: "roomId and code are required"});
    }
    try{
        const updated = await editorModel.findOneAndUpdate({roomId}, {code}, {upsert: true, new: true});
        return res.status(200).json({message: "Code saved successfully"});
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message: "Failed to save code"});
    }
}
module.exports = {saveCode};