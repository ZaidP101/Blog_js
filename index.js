import dotenv from 'dotenv'
dotenv.config();

import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import UserRouter from './routes/routeUser.js';
import ConnectionDB from './db.js';
const app = express();

const PORT = 8000;

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.get('/', (req,res) =>{
    res.render('home')
})

app.use(express.urlencoded({ extended: true }));
app.use('/user', UserRouter);
ConnectionDB()
app.listen(PORT, () => console.log(`server started on Port ${PORT}`));
