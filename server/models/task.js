var mongoose = require('mongoose');
var Task = new mongoose.Schema({
        project_id :{
            type: mongoose.Schema.Types.ObjectId,
            required: '{PATH} is required!'
        },
        user_id :{
            type: mongoose.Schema.Types.ObjectId,
            required: '{PATH} is required!'
        },
	team_member_id: {
		type: mongoose.Schema.Types.ObjectId, 
		required: '{PATH} is required!'
	},
        content: {type: String, required: '{PATH} is required!'},
        date: {type: Date, required: '{PATH} is required!'},
        status:{type: Boolean,default:false}, //True if completed
        created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', Task);