import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import UserRouter from './routes/routeUser.js';
import blogRoute from './routes/routeBlog.js';

import Blog from './models/blogModel.js';
import ConnectionDB from './db.js';
import cookieParser from 'cookie-parser';
import checkAuthCookie from './middleware/authMiddle.js';

const app = express();
const PORT = 8000;

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));


app.use(express.static('public'));
app.use(cookieParser());
app.use(checkAuthCookie("token"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.get('/', async (req,res) =>{
    const allBlogs = await Blog.find({});
    res.render('home',{
        user: req.user,
        blogs: allBlogs,
    });
});

app.use('/user', UserRouter);
app.use('/blog', blogRoute);

ConnectionDB();

app.listen(PORT, () => console.log(`server started on Port ${PORT}`));
