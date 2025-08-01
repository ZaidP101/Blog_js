import { Router } from "express";
import express from "express";
import User from "../models/userModel.js";
const UserRouter = express.Router();

UserRouter.get("/signin", (req, res) =>{
    return res.render("signin");
});
UserRouter.get("/signup", (req, res) =>{
    return res.render("signup");
});

UserRouter.post("/signup", async (req,res) =>{
    const {fullname, email, password} = req.body;
    await User.create({
        fullname:fullname,
        email:email,
        password:password,
    })
    return res.redirect("/");
})

UserRouter.post("/signin", async (req, res) =>{
    try {
        const {email, password} = req.body;
        const token = await User.matchPassword(email, password);
        console.log("UserToken", token);
        return res.cookie("token", token).redirect("/");
    } catch (error) {
        return res.render('signin', {
            error : 'Incorrect Email or Password'
        })
    }
})

UserRouter.get("/logout", (req, res) =>{
    res.clearCookie("token").redirect("/");
})

export default UserRouter;