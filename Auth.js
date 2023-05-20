const jwt=require('jsonwebtoken')
require('dotenv').config()

module.exports=(req,res,next)=>{
    const token=req.cookies.token
    if(token==null){
        return res.redirect('/')
    }
    jwt.verify(token,process.env.JSON_TOKEN_SECRET,(err,user)=>{
        if(err){
           return res.redirect('/')
        }
        req.user=user
        next()
    })
   
   /* if(token==null) return res.redirect('/')
    jwt.verify()*/
}