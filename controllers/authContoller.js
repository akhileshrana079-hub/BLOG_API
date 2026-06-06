const User = require('./models/user');
const registerUser = async(req,res)=>{
    try{
        const {name,email,password} = require('./models/user');
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                message:'User Already Exist'
            });
        }

        const hashedPassword = await bcrypt.hash(password,10);
        
    }catch(error){
        console.log()
    }
}