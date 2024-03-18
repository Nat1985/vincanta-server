import express from 'express';

import { insertNewTag } from '../controllers/fixController.js';

const fixRoute = express.Router();

fixRoute.get("/insert-new-tag", insertNewTag);

export default fixRoute;