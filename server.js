import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import winesRoute from './routes/winesRoutes.js';
import usersRoute from './routes/usersRoutes.js';
import fixRoute from './routes/fixRoutes.js';
import debugRoute from './routes/debugRoutes.js';
import foodRoute from './routes/foodRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT;

// Middlewares
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 100000 }));
app.use(cors());

// Routes import
app.use('/wines', winesRoute);
app.use('/food', foodRoute);
app.use('/users', usersRoute);
app.use('/fix', fixRoute);
app.use('/debug', debugRoute);

// Server MongoDb Connect
mongoose.connect(process.env.MONGODB_URL);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Errore di connessione al server'));
db.once('open', () => {
    console.log('Database MongoDB connesso!');
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Il server è in ascolto sulla porta ${PORT}`)
    });
});