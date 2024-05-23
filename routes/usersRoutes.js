import express from 'express';
import { addNewUser } from '../controllers/usersController.js';

const usersRoute = express.Router();

usersRoute.post("/register", addNewUser);

export default usersRoute;