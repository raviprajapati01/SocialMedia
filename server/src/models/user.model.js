import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique:true,
        trim: true,
        index:true
    },
    email: {
        type: String,
        required: true,
        unique:true,
        trim: true,
        lowercase: true
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        index:true
    },
    avatar:{
        type:String, // cloudinary url
        required:true
    },
    coverImage:{
        type:String, // cloudinary url
    },
    watchHistory:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
    password:{
        type:String,
        required:[true, 'Password is required']
    },
    refreshToken:{
        type:String
    }
}, {timestamps: true})

// hare pre() is a methos to use before the save data from database

// bcrypt is a hashing algo to use hash the data.
// before save password we can incrypt password then we can save
// eg. password = abc@gmail.com                         withot incription
// password = jk^&%^$^&*bnbVC%VB*Gvb(*rfguhjv*r128765)  after incryption

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_JWT_SCRETE,
        {
            expiresIn: process.env.TOKEN_EXPIRY
        }
    )
}
userSchema.methods.refressAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SCRETE,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

const User = mongoose.model("User", userSchema);  

export {User}