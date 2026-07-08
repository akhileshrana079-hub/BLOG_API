const User = require('../models/user');
const bcrypt = require('bcryptjs');
const registerUser = async(req,res)=>{
    try{
        const {name,email,password} = req.body;
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                message:'User Already Exist'
            });
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const user = new User({
            name,
            email,
            password:hashedPassword
        });

        await user.save();
        res.status(201).json({
            message: 'User Register Successfully'
        })
    }catch(error){
        res.status(500).json({
            message: error.message
        })
    }
}

const jwt = require('jsonwebtoken');
 const loginUser = async(req,res) =>{
    try{
        const{email,password}= req.body;
        const user = await User.findOne({email});

        if(!user){
            return res.status(404).json({
                message:'Invalid Email or Password'
            })
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );
        if(!isMatch){
            res.status(400).json({
                message:'Inavlid Email or password'
            });
        }

        const token = jwt.sign(
            {
                id:user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn:'7d'
            }
        );
        return res.status(200).json({
            message:'Login Succesfully',
            token
        })
    }catch(error){
        res.status(400).json({
            message: error.message
        })
    }
 }

module.exports={
    registerUser,
    loginUser
}