var mongoose = require('mongoose');
var ObjectId =  mongoose.Schema.Types.ObjectId
var FoodRestriction = new mongoose.Schema({
    project_id :{
        type: ObjectId, 
        required: '{PATH} is required!'
    }, 
    name: {type:String},  
}, {timestamps : true});

module.exports = mongoose.model('FoodRestriction', FoodRestriction);