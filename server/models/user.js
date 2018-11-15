var mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose');

var User = new mongoose.Schema({
	phone: {
		type: String, 
		required: '{PATH} is required!'
	},
        title: {type: String},
        firstname: {type: String},
        lastname: {type: String},
        email: {type: String},
        image: {type: String},
        dob: {type: Date},
        location: {type: String},
        status:{type:Boolean},
        role:{type:String, default:'user'},
        created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now }
});

// Passport-Local-Mongoose will add a username, 
// hash and salt field to store the username, 
// the hashed password and the salt value

// configure to use email for username field
User.plugin(passportLocalMongoose, { usernameField: 'phone' });

module.exports = mongoose.model('User', User);