var mongoose = require('mongoose'),
Schema = mongoose.Schema,
passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
  uuid: {
    type: String,
    required: false
  },
  firstname: {
    type: String,
    required: true
  },
  active: {
    type: String,
    required: false
  }
});


var options = ({missingPasswordError: "Foutief password"});
User.plugin(passportLocalMongoose,options);

module.exports = mongoose.model('User', User)
