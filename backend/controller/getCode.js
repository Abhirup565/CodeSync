const editorModel = require('../models/editor');
async function getCode(req, res){
    const {roomId} = req.query;
    if(!roomId) return res.status(400).json({code: ""});

    const doc = await editorModel.findOne({roomId});

    res.json({code: doc ? doc.code : ""});
}
module.exports = {getCode};