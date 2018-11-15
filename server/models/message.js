var mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
	bid_by:{
            type: mongoose.Schema.Types.ObjectId // user Id of a vendor
        },
        job_id:{
            type: mongoose.Schema.Types.ObjectId // LiveJob ID
        },
        job_by:{
            type: mongoose.Schema.Types.ObjectId // user id of a person who added a job i.e. planner
        },
        msg_by:{
            type: mongoose.Schema.Types.ObjectId // msg sent by which user
        },
        // Basic Details
        content:{type:String},
        attachment:{type:String},
        read:{type:Number,default:0}, // 1 if bid is read by planner
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now }
});

postSchema.pre('save', function(next){
  now = new Date();
  this.updated_at = now;
  next();
});

module.exports = mongoose.model('messages', postSchema);