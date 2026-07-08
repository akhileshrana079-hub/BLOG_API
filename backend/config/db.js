const moongoose = require('mongoose');
const connectedDB = async()=>{
    try{
        await moongoose.connect(process.env.MONGO_URI);
        console.log('MongDB Connected');
    }catch(error){
        console.log('MongoDB Connection Error');
        process.exit(1);
    }
};

module.exports= connectedDB;