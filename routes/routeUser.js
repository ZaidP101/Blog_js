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
    const {email, password} = req.body;
    const user = await User.matchPassword(email, password);
    console.log("User", user);
    return res.redirect("/");
})


export default UserRouter;