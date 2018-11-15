var mongoose = require('mongoose');
//Accommodation Details
var AccommodationDetailsSchema = new mongoose.Schema({
    rooms_required:{type:Number},
    room_type:{type:String},
    pickupDetails:{type:Object},
    dropoffDetails:{type:Object},
    locked_details:{type:Boolean}, //0 if locked by planner, 1 notified to guest
    hotel:{type:String},
    room_no:{type:String},
    address:{type:String}
}, { usePushEach: true })
// Food Restrictions
var FoodRestrictionsSchema = new mongoose.Schema({
    type:{type:Array},
   // meals:{type:Number}
})
// Events Schema
var EventsSchema = new mongoose.Schema({
    event_id:{type:mongoose.Schema.Types.ObjectId},
    guest_response:{type: Number, default:1}, // 1= Invited & Unread, 2=Declined, 3=Accepted
    accomodation_request:{type:Boolean,default:false},
    food_restrictions_request:{type:Boolean,default:false},
    accomodation:[AccommodationDetailsSchema],
    //food_restrictions:[FoodRestrictionsSchema],
    food_restrictions:{type:Array},
}, { usePushEach: true })

var Invitation = new mongoose.Schema({
        project_id:{
            type: mongoose.Schema.Types.ObjectId //5b43582a716d9a4e96345f4a
        },
//        event_id:{
//            type: mongoose.Schema.Types.ObjectId // 5b43582a716d9a4e96345f4b
//        },
        invitation_to:{
            type: mongoose.Schema.Types.ObjectId // guest Id //5b62adbc8465e0222a825daa
        },
        phone:{type:String},
        posted_by:{
            type: mongoose.Schema.Types.ObjectId //5b126966bcc8072e526346ad
        },
        no_of_guests:{type: Number},
        invitation_code:{type:String},
        events :[EventsSchema],
        //status:{type: Number,default:1}, //1=Invited & Unread, 2=Declined, 3= Accepted
        created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now }
}, { usePushEach: true });

module.exports = mongoose.model('Invitation', Invitation);