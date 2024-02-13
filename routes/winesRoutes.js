import express from 'express';
import { addNewWine, deleteWineById, editWineById, getAllWines, getWineById } from "../controllers/winesController.js";

const winesRoute = express.Router();

winesRoute.post('/add-new-wine', addNewWine);
winesRoute.delete('/delete-wine', deleteWineById);
winesRoute.get('/get-all-wines', getAllWines);
winesRoute.get('/get-wine', getWineById);
winesRoute.patch('/edit-wine', editWineById);

export default winesRoute;