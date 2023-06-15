const mongoose = require('mongoose');
const MONGODB_URI = 'mongodb+srv://aniolcp:np4be6S5Cm6@tfg.asob0lz.mongodb.net/test';

mongoose.connect(MONGODB_URI)
    .then(db => console.log('MongoDB is connected to', db.connection.host))
    .catch(err => console.error(err));

module.exports = mongoose;