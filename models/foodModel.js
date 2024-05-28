import mongoose from "mongoose";

const FoodModelSchema = new mongoose.Schema({
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
    notes: {
        type: String,
        required: false
    }
}, { timestamps: true, strict: 'true'});

export const FoodModel = mongoose.model('FoodModel', FoodModelSchema, 'Food')