import express from 'express';
import { AddNewFood } from '../controllers/foodController.js';

const foodRoute = express.Router();

foodRoute.post("/new-food", AddNewFood);

export default foodRoute;
