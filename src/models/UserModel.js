const mongoose = require('mongoose')
const {Schema} = mongoose;

const UserSchema = new Schema({
    userId: {type: String, required: false},
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    mainHand: {type: String, required: true},
    nomenclature: {type: String, required: true}
});

module.exports = mongoose.model('User', UserSchema);