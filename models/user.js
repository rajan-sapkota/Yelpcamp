const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {type: String,
        required:true,
        uniquie:true
    }

})

UserSchema.plugin(passportLocalMongoose);           //adds the username along with the salt and hash

module.exports= mongoose.model('User', UserSchema);
