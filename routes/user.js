require('dotenv').config()
const jwt_secret=process.env.JSON_TOKEN_SECRET
const express =require('express')
const userRoute=express.Router()
const mongoose=require('mongoose')
const userModel=require('../db/model/userModel')
const jwt=require('jsonwebtoken')

userRoute.post('',async(req,res)=>{
    console.log(jwt_secret)
    const name=req.body.name
    const password=req.body.password
    console.log(name)
    console.log(password)
    const user= await userModel.findOne({
        userName:name
    })
    if(user==null){
        req.flash('error', 'User does not exist');
        res.redirect('/')
    }
    else{
        if(user.password==password){
        const token=jwt.sign({userName:user.userName,id:user._id},jwt_secret)
        res.cookie('token',token)
        res.render('home',{userName:user.userName,id:user._id})
        }
        else{
        
        req.flash('error', 'Wrong Password');  
        res.redirect('/')
        }
    }
    
    
})

module.exports=userRoute