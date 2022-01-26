var mongoose            = require("mongoose"),
passportLocalMongoose   = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
});

UserSchema.plugin(passportLocalMongoose, {
    usernameLowerCase: true,
});

module.exports = mongoose.model("User", UserSchema);