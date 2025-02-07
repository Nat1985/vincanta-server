import express from 'express';
import { addNewWine, countWines, deleteImage, deleteWineById, editWineById, getAllWines, getWineById, uploadImage } from "../controllers/winesController.js";

const winesRoute = express.Router();

winesRoute.post('/add-new-wine', addNewWine);
winesRoute.delete('/delete-wine', deleteWineById);
winesRoute.get('/get-all-wines', getAllWines);
winesRoute.get('/get-wine', getWineById);
winesRoute.patch('/edit-wine', editWineById);
winesRoute.get("/count-wines", countWines);
winesRoute.post("/upload-image", uploadImage);
winesRoute.delete("/delete-image", deleteImage);

export default winesRoute;