import express from 'express';
import { AddNewFood } from '../controllers/foodController';

const foodRoute = express.Router();

foodRoute.post("/new-food", AddNewFood);

export default foodRoute;
