import mongoose, { Schema } from "mongoose";

const commentRout = mongoose.Schema({
    content :{
        type: String,
        required: true,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    blogId :{
        type : Schema.Types.ObjectId,
        ref: "Blog",
    },
}, { timestamps : true }
)

const Comment = mongoose.model("Comment", commentRout);
export default Comment;