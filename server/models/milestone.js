var mongoose = require('mongoose');
var DraftSchema = new mongoose.Schema({
        event_id:{
            type: mongoose.Schema.Types.ObjectId
        },
        project_id:{
            type: mongoose.Schema.Types.ObjectId
        },
        posted_by:{
            type: mongoose.Schema.Types.ObjectId
        },
        title: {type: String},
        assigned_to:{type:Array}, //team member id
        type: {type: String}, // default if added by admin
        date:{type:Date},
        sort_order: {type: Number},
        status:{type: Boolean,default:false},
        created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now }
});

var Milestone = new mongoose.Schema({
        event_id:{
            type: mongoose.Schema.Types.ObjectId
        },
        project_id:{
            type: mongoose.Schema.Types.ObjectId
        },
        posted_by:{
            type: mongoose.Schema.Types.ObjectId
        },
        title: {type: String},
        type: {type: String}, // default if added by admin
        date:{type:Date},
        sort_order: {type: Number},
        status:{type: Boolean,default:false},
        draft:[DraftSchema],
        created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Milestone', Milestone);