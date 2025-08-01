import mongoose from "mongoose";
import { error } from "node:console";
import {createHmac, randomBytes} from "node:crypto"
import { type } from "node:os";
import {createToken, validateToken} from "../util/auth.js"

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required : true,
        unique :true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    salt:{
        type: String,
    },
    password:{
        type: String,
        required: true,
    },
    profileimg: {
        type: String,
        default: '/images/avatar.png',
    },
    role:{
        type : String,
        enum: ["USER", "ADMIN"],
        default: "USER",
    },
},{
timestamps : true
});

userSchema.pre("save", function(next){
    const user = this;

    if(!user.isModified("password")) return;
    const salt = randomBytes(16).toString();
    const hashPass = createHmac('sha256', salt)
    .update(user.password)
    .digest("hex");

    this.salt =salt;
    this.password = hashPass;

    next();
});

userSchema.static("matchPassword", async function(email, password){
    const user = await this.findOne({ email});
    if(!user) throw new Error("user not found");
    const hashedpass = user.password;
    const salt = user.salt;
    const checkPass =  createHmac('sha256', salt)
    .update(password)
    .digest("hex");

    if(checkPass !== hashedpass) throw new Error("Incorrect password")

    const token = createToken(user);
    return token
})

const User = mongoose.model('User', userSchema);
export default User;
