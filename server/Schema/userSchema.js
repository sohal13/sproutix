import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique:true
    },
    phone:{
        type:Number,
        required:true
    },
    password: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        default:"https://t4.ftcdn.net/jpg/03/40/12/49/360_F_340124934_bz3pQTLrdFpH92ekknuaTHy8JuXgG7fi.jpg"
    },
    isSeller:{
        type:Boolean,
        default:false
    },
    isAdmin:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

const User = mongoose.model('User', userSchema)

export default User;