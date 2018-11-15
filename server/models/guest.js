var mongoose = require('mongoose');
var Guest = new mongoose.Schema({
        project_id:{
            type: mongoose.Schema.Types.ObjectId
        },
        posted_by:{
            type: mongoose.Schema.Types.ObjectId
        },
        posted_by_label:{type:String,default:'Planner'},
        name: {type: String},
        email: {type: String},
        phone: {type: String},
        location: {type: String},
        group: {type: String},
        from:{type:String}, //Groom/Bride
        status:{type: Boolean,default:true},
        created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Guest', Guest);