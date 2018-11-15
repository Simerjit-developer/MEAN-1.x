var mongoose = require('mongoose');
var Group = new mongoose.Schema({
        title: {type: String},
        type: {type: String,default:'default'}, // default if added by admin
        status:{type: Boolean,default:true},
        added_by:{type:mongoose.Schema.Types.ObjectId},
        project_id:{type:mongoose.Schema.Types.ObjectId},
        side:{type:Array}, // Groom/Bride or both
        created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Group', Group);