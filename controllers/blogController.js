const Blog = require('../models/blog');

const createBlog = async (req, res) => {
    try {

        const { title, content } = req.body;

        const blog = new Blog({
            title,
            content,
            author: req.user.id
        });

        await blog.save();

        res.status(201).json(blog);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find();

        res.status(200).json(blogs);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getBlogById = async (req, res) => {
    try {

        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                message: 'Blog not found'
            });
        }

        res.status(200).json(blog);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const updateBlog = async (req, res) => {
    try {

        const { title, content } = req.body;

        const blog = await Blog.findById(req.params.id);
        if (blog.author.toString() !== req.user.id) {
        return res.status(401).json({
        message: 'Not Authorized'
    });
}
        if (!blog) {
            return res.status(404).json({
                message: 'Blog not found'
            });
        }

        blog.title = title || blog.title;
        blog.content = content || blog.content;

        const updatedBlog = await blog.save();

        res.status(200).json(updatedBlog);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const deleteBlog = async (req, res) => {
    try {

        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                message: 'Blog not found'
            });
        }

        if (blog.author.toString() !== req.user.id) {
            return res.status(401).json({
                message: 'Not Authorized'
            });
        }

        await blog.deleteOne();

        res.status(200).json({
            message: 'Blog Deleted Successfully'
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
module.exports = {
    createBlog,
    getBlogs,
    getBlogById,
    updateBlog,
    deleteBlog
};