var mongoose = require("mongoose");


var particpantSchema = new mongoose.Schema({
    _id: String,
    name: String,
    marriedTo: {
    	type: mongoose.Schema.Types.ObjectId,
        ref: 'participant'
    }
});

module.exports = mongoose.model("particpant", particpantSchema);