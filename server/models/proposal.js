var mongoose = require('mongoose');
// Milestones Schema
var milestonesSchema = new mongoose.Schema({
    title: {type: String},
   // date:{type:Date},
   // sort_order: {type: Number},
   // status:{type: Boolean,default:false},
})

var postSchema = new mongoose.Schema({
	bid_by:{
            type: mongoose.Schema.Types.ObjectId // user Id
        },
        job_id:{
            type: mongoose.Schema.Types.ObjectId // LiveJob ID
        },
        // Basic Details
        description:{type:String},
        // Budget & Milestones
        budget:{type:String},
        milestones:[milestonesSchema],
        status:{type:Number, default: 0}, //1=shortlisted, 2= finalized, 3= completed, 4 = declined,5=finalized by vendor by accepting invitation
        read:{type:Boolean,default:0}, // 1 if bid is read by planner
        display_status:{type:Boolean,default:0}, // 1 if deleted by vendor
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now }
});

postSchema.pre('save', function(next){
  now = new Date();
  this.updated_at = now;
  next();
});

module.exports = mongoose.model('proposals', postSchema);