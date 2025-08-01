import mongoose, { Schema } from "mongoose";

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    body: {
        type : String,
        required : true,
    },
    coverimg: {
        type: String,
        required : false,
    },
    createdBy:{
        type : Schema.Types.ObjectId,
        ref : "User",
    },
}, {timestamps : true}
);

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;