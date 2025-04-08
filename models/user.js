require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true, // Use new URL parser
    useUnifiedTopology: true // Use new topology engine
})
.then(() => {
    console.log('MongoDB connected...');
})
.catch(err => {
    console.error('MongoDB connection error:', err);
});

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    imageurl: String
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
// This code connects to a MongoDB database and defines a Mongoose schema for a User model.