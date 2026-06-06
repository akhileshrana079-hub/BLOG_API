require('dotenv').config();
const express = require('express');
const app = express();
const connectedDB = require('./config/db');
connectedDB();

app.use(express.json());
app.get('/',(req,res)=>{
    res.send('Blog API Running');
})
app.listen(process.env.PORT,()=>{
    console.log(`Server is listenong on the port ${process.env.PORT}`);
});