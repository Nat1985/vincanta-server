import express from 'express';
import { addNewWine, deleteWineById } from "../controllers/winesController.js";

const winesRoute = express.Router();

winesRoute.post('/add-new-wine', addNewWine);
winesRoute.delete('/delete-wine', deleteWineById);

export default winesRoute;