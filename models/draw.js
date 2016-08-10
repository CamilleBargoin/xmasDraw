var mongoose = require("mongoose");


var drawSchema = new mongoose.Schema({
    _id: String,
    participants: [{
    	type: mongoose.Schema.Types.ObjectId,
        ref: 'participant'
    }]
});

module.exports = mongoose.model("draw", drawSchema);