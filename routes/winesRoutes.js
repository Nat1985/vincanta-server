import express from 'express';
import { addNewWine, deleteWineById, getAllWines } from "../controllers/winesController.js";

const winesRoute = express.Router();

winesRoute.post('/add-new-wine', addNewWine);
winesRoute.delete('/delete-wine', deleteWineById);
winesRoute.get('/get-all-wines', getAllWines);

export default winesRoute;