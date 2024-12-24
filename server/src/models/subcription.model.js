import mongoose from "mongoose";

const subCriptionSchema = new mongoose.Schema({
    subscriber:{
        type: mongoose.Schema.Types.ObjectId, // one who subsciber
        ref: 'User'
    },
    channel:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {timestamps: true})

const Subcription = new mongoose.model("Subcription", subCriptionSchema);