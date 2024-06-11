import mongoose from "mongoose";

const FoodModelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    course: {
        type: String,
        required: true,
        enum: ["Antipasto", "Primo", "Secondo", "Contorno"]
    },
    price: {
        type: Number,
        required: true
    },
    allergens: [{
        type: String,
        required: false
    }],
    isFrozen: {
        type: Boolean,
        required: false,
        default: false
    },
    notes: {
        type: String,
        required: false
    }
}, { timestamps: true, strict: 'true'});

export const FoodModel = mongoose.model('FoodModel', FoodModelSchema, 'Food')