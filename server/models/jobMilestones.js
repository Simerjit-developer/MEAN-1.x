var mongoose = require('mongoose');
var TaskSchema = new mongoose.Schema({
        posted_by:{
            type: mongoose.Schema.Types.ObjectId //can be vendor id or planner id
        },
        title: {type: String},
        date:{type:Date},
        status:{type: Boolean,default:false}, //1=completed
        created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now }
});

var JobMilestone = new mongoose.Schema({
        job_id:{
            type: mongoose.Schema.Types.ObjectId // Represensts Live Job id
        },
        posted_by:{
            type: mongoose.Schema.Types.ObjectId
        },
        title: {type: String},
        start_date: {type: Date}, // date selected by user
        end_date:{type:Date},
        status:{type: Boolean,default:false}, //1=completed
        tasks:[TaskSchema],
        created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('JobMilestone', JobMilestone);