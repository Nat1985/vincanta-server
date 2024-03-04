import express from 'express';

import { insertVolumeTag } from '../controllers/fixController.js';

const fixRoute = express.Router();

fixRoute.get("/insert-volume-tag", insertVolumeTag);

export default fixRoute;