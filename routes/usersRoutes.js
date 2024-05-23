import express from 'express';
import { addNewUser, login } from '../controllers/usersController.js';

const usersRoute = express.Router();

usersRoute.post("/register", addNewUser);
usersRoute.post("/login", login);

export default usersRoute;