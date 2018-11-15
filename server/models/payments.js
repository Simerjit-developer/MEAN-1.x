var mongoose = require('mongoose');

var Payment = new mongoose.Schema({
        job_id:{
            type: mongoose.Schema.Types.ObjectId // Represensts Live Job id
        },
        posted_by:{
            type: mongoose.Schema.Types.ObjectId
        },
        milestone_id:{type: mongoose.Schema.Types.ObjectId},
        amount: {type: Number}, // amount needs to be paid
        due_date:{type:Date},
        status:{type: Boolean,default:false}, //1=paid
        created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', Payment);