import express from 'express';
import { addNewUser, login, resetPasswordRequest, setNewPassword, verifyAndRefreshToken } from '../controllers/usersController.js';

const usersRoute = express.Router();

usersRoute.post("/register", addNewUser);
usersRoute.post("/login", login);
usersRoute.post("/reset-password-request", resetPasswordRequest);
usersRoute.post("/set-new-password", setNewPassword);
usersRoute.post("/verify-token", verifyAndRefreshToken);

export default usersRoute;