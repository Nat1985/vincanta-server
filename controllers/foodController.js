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

export const getAllFood = async (req, res) => {
    try {
        const food = await FoodModel.find();
        res.status(200).send({
            statusCode: 200,
            payload: food
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

export const getFoodById = async (req, res) => {
    const { id } = req.params;
    try {
        if (id) {
            const food = await FoodModel.findById(id);
            if (!food) {
                return res.statuts(404).send({
                    statusCode: 404,
                    message: `Nessun oggetto con id ${id} trovato.`
                })
            }
            res.status(200).send({
                statusCode: 200,
                payload: food
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            statusCode: 500,
            message: 'Internal Server Error',
            error: error
        })
    }
}

export const editFood = async (req, res) => {
    const { id } = req.params;
    if (id) {
        try {
            const newFood = await FoodModel.findByIdAndUpdate(
                id,
                {
                    name: req.body.name,
                    course: req.body.course,
                    price: req.body.price,
                    allergens: req.body.allergens,
                    notes: req.body.notes
                },
                { new: true }
            )
            if (!newFood) {
                res.status(404).send({
                    statusCode: 404,
                    message: `Nessun elemento con id ${id} trovato.`
                })
            }
            res.status(200).send({
                statusCode: 200,
                messagge: `Oggetto con id ${id} aggiornato correttamente.`,
                payload: newFood
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
}

export const deleteFood = async (req, res) => {
    const { id } = req.params;
    try {
        const food = await FoodModel.findByIdAndDelete(id);
        if (!food) {
            res.status(404).send({
                statusCode: 404,
                message: `Nessun oggetto con id ${id} trovato.`
            })
        }
        res.status(200).send({
            statusCode: 200,
            messaggio: `Oggetto con id ${id} eliminato correttamente.`
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