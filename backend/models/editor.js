const mongoose = require('mongoose');

const editorSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true,
        unique: true
    },
    code: {
        type: String,
        required: true
    }
});

const editorModel = mongoose.model("Editor-code", editorSchema);

module.exports = editorModel;