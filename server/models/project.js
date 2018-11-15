var mongoose = require('mongoose');

var EventSchema = new mongoose.Schema({
    name: {type:String},
    description:{type:String},
    address: {type:String},
    location: {type:String},
    no_of_guests: {type:String},
    start_date: {type:Date},
    end_date: {type:Date},
    duration: {type:String},
    budget: {type:String},
    event_id:{type: mongoose.Schema.Types.ObjectId}
});
var TeamSchema = new mongoose.Schema({
    name: {type:String},
    email: {type:String},
    phone: {type:String},
    location:{type:String},
    message:{type:String}
});
var DraftSchema = new mongoose.Schema({
    name: {type: String},
    user_id:{type: mongoose.Schema.Types.ObjectId},
    client: {type: Object},
    no_of_events: {type: String},
    start_date:{type:Date},
    end_date:{type:Date},
    budget:{type: String},
    groom:{type:Object},
    bride:{type:Object},
    events:[EventSchema],
    team:[TeamSchema],
    status:{type:Number,default:1}, //0=Inactive, 1=Active, 2=Completed
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

var Project = new mongoose.Schema({
    name: {
        type: String, 
        required: '{PATH} is required!'
    },
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        required:'{PATH} is required!'
    },
    client: {type: Object},
    no_of_events: {type: String, default:0},
    start_date:{type:Date, required: '{PATH} is required!'},
    end_date:{type:Date, required: '{PATH} is required!'},
    budget:{type: String},
    groom:{type:Object},
    bride:{type:Object},
    events:[EventSchema],
    team:[TeamSchema],
    draft: [DraftSchema],
    status:{type:Number,Default:1}, //0=Inactive, 1=Active, 2=Completed
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});
//TeamSchema.pre('save', function (next) {
//  if (this.isNew && 0 === this.check.length) {
//    this.check = undefined;                                                                                                                                   
//  }
//  next();
//})
module.exports = mongoose.model('Project', Project);