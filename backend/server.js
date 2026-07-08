require('dotenv').config();
const express = require('express');
const app = express();
const cors = require("cors");
const connectedDB = require('./config/db');
connectedDB();

app.use(cors());
app.use(express.json());
const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');
app.use('/auth', authRoutes);
app.use('/blogs',blogRoutes);

const protect = require('./middleware/authMiddleware');

app.get('/profile', protect, (req, res) => {
    res.json({
        message: 'Protected Route',
        user: req.user
    });
});
app.listen(process.env.PORT,()=>{
    console.log(`Server is listenong on the port ${process.env.PORT}`);
});