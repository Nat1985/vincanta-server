import express from 'express';

import { getCoteDuRhone, insertIsFrozen, insertIsGoodValueKey, insertNewTag, updateCoteDuRhone } from '../controllers/fixController.js';

const fixRoute = express.Router();

/* fixRoute.get("/insert-new-tag", insertNewTag); */
/* fixRoute.get("/get-rhone", getCoteDuRhone);
fixRoute.get("/update-rhone", updateCoteDuRhone); */
/* fixRoute.get("/insert-is-good-value", insertIsGoodValueKey); */
/* fixRoute.get("/insert-is-frozen", insertIsFrozen); */

export default fixRoute;