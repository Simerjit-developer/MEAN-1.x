var mongoose = require('mongoose');
var ObjectId =  mongoose.Schema.Types.ObjectId
var Hotel = new mongoose.Schema({
    project_id :{
        type: ObjectId, 
        required: '{PATH} is required!'
    },
    // user_id :{
    //     type: mongoose.Schema.Types.ObjectId,  
    //     required: '{PATH} is required!'
    // },
    name: {type:String}, 
    address: {type:String},
    location: {type:String},
    no_of_rooms: {type:String}
}, {timestamps : true});

module.exports = mongoose.model('Hotel', Hotel);