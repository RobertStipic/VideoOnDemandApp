import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    city: {
        type:String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    isSubscribed:{
        type: Boolean,
        default: false
    }
});


const User = mongoose.model('User', userSchema);

export {User};