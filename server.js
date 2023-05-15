require('dotenv').config()
const port=process.env.PORT
const db_url=process.env.DB_URL
const express=require('express')
const app=express()
const mongoose=require('mongoose')
const userRoute=require('./routes/user')
const bodyParser=require('body-parser')
const userModel=require('./db/model/userModel')
const flash=require('connect-flash')
const session = require('express-session')

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
  }));
  
app.use(flash());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/home',userRoute)

app.set("view engine","ejs")
app.set("views",'./views')

app.get('/',(req,res)=>{
    const errorMessage = req.flash('error');
    res.render('index',{message:errorMessage})
})
app.get('/home',(req,res)=>{
    res.send('Hello')
})
app.get('/signup',(req,res)=>{
    const message=req.flash('message');
    res.render('register',{message:message})
})
app.post('/signup',async(req,res)=>{
    const name=req.body.name
    const password=req.body.password
    try{
        const user=new userModel({
            userName:name,
            password:password 
        })
        await user.save()
        req.flash('message',"User Register Sucessfully")
        res.redirect('signup')
       
    }
    catch(e){
        req.flash('message',"Error creating user")
        res.redirect('signup')
        
    }

})
app.get('/register',(req,res)=>{
    const message=req.flash('message');
    res.render('register',{message:message})
})

app.listen(port,()=>{
    console.log(`sucessfully connected to ${port}`)
})
mongoose.connect(db_url)
.then(()=>{console.log('sucessfully connected to mongodb server')})
.catch(e=>console.log(e.message))