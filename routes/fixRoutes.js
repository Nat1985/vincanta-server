import express from 'express';

import { getCoteDuRhone, insertNewTag, updateCoteDuRhone } from '../controllers/fixController.js';

const fixRoute = express.Router();

/* fixRoute.get("/insert-new-tag", insertNewTag); */
/* fixRoute.get("/get-rhone", getCoteDuRhone);
fixRoute.get("/update-rhone", updateCoteDuRhone); */

export default fixRoute;