import express from 'express';

import { getCoteDuRhone, insertIsBio, insertIsFrozen, insertIsGoodValueKey, insertNewTag, updateCoteDuRhone } from '../controllers/fixController.js';

const fixRoute = express.Router();

/* fixRoute.get("/insert-new-tag", insertNewTag); */
/* fixRoute.get("/get-rhone", getCoteDuRhone);
fixRoute.get("/update-rhone", updateCoteDuRhone); */
/* fixRoute.get("/insert-is-good-value", insertIsGoodValueKey); */
/* fixRoute.get("/insert-is-frozen", insertIsFrozen); */
/* fixRoute.get("/insert-bio", insertIsBio); */

export default fixRoute;