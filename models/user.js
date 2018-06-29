const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');

const UserSchema = new Schema({
	email: {type: String, unique: true, lowercase: true},
	name: String,
	password: String,
	picture: String,
	isSeller: {type: Boolean, default: false},
	address: {
		addr1: String,
		addr2: String,
		city: String,
		state: String,
		country: String,
		postalCode: String,
	},
	created: {type: Date, default: Date.now}
});

//This function will encrypt the password before of saving the user 
UserSchema.pre('save', function(next){
	var user = this;//We are referencing the var of UserSchema 
	
	if(!user.isModified('password')) return next();

	bcrypt.hash(user.password, null, null, function(err, hash){
		if(err) return next(err);

		user.password = hash;
		next();
	});
});

//This function is for comparing the password typed with the password storaged on the database
UserSchema.methods.comparePassword = function(password){

	return bcrypt.compareSync(password, this.password);//Password typed in and password in the database
};

//Website API that generate an image for us everytime we use the signup
UserSchema.methods.gravatar = function(size){
	if(!this.size) size = 200;
	if(!this.email){
		return 'http://gravatar.com/avatar/?s' + size + '&d=retro';
	}else{
		var md5 = crypto.createHash('md5').update(this.email).digest('hex');
		return 'http://gravatar.com/avatar/'+ md5 + '?s' + size + '&d=retro';
	}
	
}

//He we are exporting the Object to be used in other files
module.exports = mongoose.model('User', UserSchema);

