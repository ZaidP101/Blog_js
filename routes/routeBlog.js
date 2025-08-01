import { Router } from "express";
import express from "express";
import multer from "multer";
import path from "path";
import Blog from "../models/blogModel.js";
import Comment from "../models/commentsModel.js";

const blogRoute =  express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/upload`))
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  }
})

const upload = multer({ storage: storage })

blogRoute.get('/add', (req, res) =>{
    return res.render("addblog", {
        user: res.user,
    });
})

blogRoute.post("/add", upload.single('coverImage'), async (req, res) =>{
  console.log(req.body);
  const {title, body} = req.body;
  const blog = await Blog.create({
    body,
    title,
    createdBy: req.user._id,
    coverimg: `/upload/${req.file.filename}`,
  })
  console.log(req.body);
  return res.redirect(`/blog/${blog._id}`);
})

blogRoute.get("/:id", async (req, res)=>{
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  console.log("blog", blog)
  return res.render('blog', {
    user: req.user,
    blog,
  });
})

blogRoute.post('/comment/:blogId', async (req, res) => {
  await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy : req.user._id
  })
  return res.redirect(`/blog/${req.params.blogId}`)
})

export default blogRoute;