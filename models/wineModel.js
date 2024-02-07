import mongoose from "mongoose";

const WineModelSchema = new mongoose.Schema({
    country: {
        type: String,
        required: true
    },
    region: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enmu: ['Rosso', 'Bianco', 'Rosé']
    },
    name: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    tablePrice: {
        type: Number,
        required: true
    },
    takeAwayPrice: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: false,
        default: ''
    },
    favourite: {
        type: Boolean,
        required: false,
        default: false
    },
    available: {
        type: Boolean,
        required: false,
        default: true
    }
}, { timestamps: true, strict: 'throw' })

export const WineModel = mongoose.model('WineModel', WineModelSchema, 'Wines');