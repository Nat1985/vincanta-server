import { FoodModel } from "../models/foodModel.js";

export const AddNewFood = async (req, res) => {
    const { name, course, price, allergens, notes } = req.body;
    try {
        const newFood = new FoodModel({
            name: name,
            course: course,
            price: price,
            allergens: allergens ? allergens : null,
            notes: notes ? notes : null
        })
        const food = await newFood.save();
        res.status(201).send({
            statusCode: 201,
            message: "Nuovo piatto inserito con successo."
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            statusCode: 500,
            message: 'Internal Server Error',
            error: error
        })
    }
}