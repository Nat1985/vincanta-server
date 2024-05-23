import mongoose from "mongoose";

const UserModelSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {timestamps: true, strict: 'throw'});

export const UserModel = mongoose.model('UserModel', UserModelSchema, 'Users');