var mongoose = require('mongoose');

var Event = new mongoose.Schema({
        name: {type: String,required: '{PATH} is required!'},
        description: {type: String},
        image: {type: String},
        status:{type: Boolean,default:false},
        created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Event', Event);