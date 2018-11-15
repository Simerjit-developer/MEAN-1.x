var mongoose = require('mongoose');
var ObjectId =  mongoose.Schema.Types.ObjectId
var Budget = new mongoose.Schema({
        project_id :{
            type: ObjectId, 
            required: '{PATH} is required!'
        },
        user_id :{
            type: mongoose.Schema.Types.ObjectId, // most probably the planner
            required: '{PATH} is required!'
        },
        item: { type: String, required: '{PATH} is required!' },
        invoice: { type: String  },
        cost : {  type: String, required: '{PATH} is required!' },
        due_date: { type: Date, required: '{PATH} is required!' },
        event_id : { 
            type: mongoose.Schema.Types.ObjectId, 
            required: '{PATH} is required!' 
        },
        service_id : { 
            type: mongoose.Schema.Types.ObjectId, default : null
        },
        // created_at: { type: Date, default: Date.now },
	    // updated_at: { type: Date, default: Date.now }
}, {timestamps : true});

module.exports = mongoose.model('Budget', Budget);