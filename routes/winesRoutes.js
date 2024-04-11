import express from 'express';
import { addNewWine, countWines, deleteWineById, editWineById, getAllWines, getWineById } from "../controllers/winesController.js";

const winesRoute = express.Router();

winesRoute.post('/add-new-wine', addNewWine);
winesRoute.delete('/delete-wine', deleteWineById);
winesRoute.get('/get-all-wines', getAllWines);
winesRoute.get('/get-wine', getWineById);
winesRoute.patch('/edit-wine', editWineById);
winesRoute.get("/count-wines", countWines);

export default winesRoute;