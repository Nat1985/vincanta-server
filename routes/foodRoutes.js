import express from 'express';
import { AddNewFood, deleteFood, editFood, getAllFood, getFoodById } from '../controllers/foodController.js';

const foodRoute = express.Router();

foodRoute.get("/", getAllFood);
foodRoute.get("/:id", getFoodById);
foodRoute.post("/new-food", AddNewFood);
foodRoute.patch("/edit/:id", editFood);
foodRoute.delete("/delete/:id", deleteFood);

export default foodRoute;
