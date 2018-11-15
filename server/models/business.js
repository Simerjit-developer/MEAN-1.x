var mongoose = require('mongoose');

var Business = new mongoose.Schema({
        user_id :{
            type: mongoose.Schema.Types.ObjectId,
            required: '{PATH} is required!'
        },
	vendortype_id: {
		type: String, 
		required: '{PATH} is required!'
	},
        company_name: {type: String},
        established_in: {type: String},
        company_phone: {type: String},
        starting_price: {type: String},
        services: {type: Object},
        highlights:{type:Object},
        primary_email:{type: String,required: '{PATH} is required!'},
        address:{type: String},
        city:{type: String},
        state:{type: String},
        country:{type: String},
        pincode:{type: String},
        award:{type: Object},
        status:{type: Boolean,default:false},
        created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Business', Business);