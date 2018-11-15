var mongoose = require('mongoose');
//Job Details
var JobDetailsSchema = new mongoose.Schema({
    start_date:{type:Date},
    end_date:{type:Date},
    time:{type:String},
    address:{type:Object},
    keyDetails:{type:Object}
})

// Milestones Schema
var milestonesSchema = new mongoose.Schema({
    title: {type: String},
    date:{type:Date},
    sort_order: {type: Number},
    status:{type: Boolean,default:false},
})
// Schema to save draft data
var DraftSchema = new mongoose.Schema({
	posted_by:{
            type: mongoose.Schema.Types.ObjectId
        },
        vendortype_id:{
            type: mongoose.Schema.Types.ObjectId
        },
        service_id:{
            type: mongoose.Schema.Types.ObjectId
        },
        event_id:{
            type: mongoose.Schema.Types.ObjectId
        },
        project_id:{
            type: mongoose.Schema.Types.ObjectId
        },
        jobDetails:{type:Object},
        addressDetails:{type:Object},
        budget:{type:String},
        milestones:[milestonesSchema],
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now }
});
var postSchema = new mongoose.Schema({
	posted_by:{
            type: mongoose.Schema.Types.ObjectId
        },
        vendortype_id:{
            type: mongoose.Schema.Types.ObjectId
        },
        service_id:{
            type: mongoose.Schema.Types.ObjectId
        },
        event_id:{
            type: mongoose.Schema.Types.ObjectId
        },
        project_id:{
            type: mongoose.Schema.Types.ObjectId
        },
        jobDetails:{type:Object},
        addressDetails:{type:Object},
        budget:{type:String},
       // draft: [DraftSchema],
        milestones:[milestonesSchema],
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now }
});

postSchema.pre('save', function(next){
  now = new Date();
  this.updated_at = now;
  next();
});

module.exports = mongoose.model('JobPost', postSchema);