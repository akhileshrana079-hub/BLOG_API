const moongoose = require('mongoose');

const blogSchema = new moongoose.Schema({
    title:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    author:{
        type:moongoose.Schema.Types.ObjectId,
        ref:'User'
    }
});

const Blog = moongoose.model('Blog',blogSchema);
module.exports = Blog;