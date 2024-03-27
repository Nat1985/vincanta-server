import express from 'express';
import { getWinesByCountry } from '../controllers/debugController.js';

const debugRoute = express.Router();

debugRoute.get('/get-country', getWinesByCountry);

export default debugRoute;