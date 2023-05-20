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
const cookieParser = require('cookie-parser');
const Auth=require('./Auth')
const projectModel=require('./db/model/projectModel')
const studentModel=require('./db/model/student')

app.use(cookieParser())
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
    res.clearCookie('token')
    const errorMessage = req.flash('error');
    res.render('index',{message:errorMessage})
})
app.get('/home',Auth,async(req,res)=>{
    const token=req.cookies.token
    //console.log(req.user)
    const yearAr=await projectModel.distinct('year')
    const projectAr=await projectModel.find({year:"2023"})
    //console.log(projectAr)
    console.log(yearAr)
     res.render('home',{userName:req.user.userName,projectAr,yearAr,selectedYear:''})
})
app.get('/signup',(req,res)=>{
    res.clearCookie('token')
    const message=req.flash('message');
    res.render('register',{message:message})
})
app.post('/signup',async(req,res)=>{
    res.clearCookie('token')
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
    res.clearCookie('token')
    const message=req.flash('message');
    res.render('register',{message:message})
})
app.get('/logout',(req,res)=>{
    res.clearCookie('token')
    res.redirect('/')
})
app.post('/project',async(req,res)=>{
    const grade=req.body.grade
    const year=req.body.year
    const pmodel=new projectModel({
        name:grade,
        year:year
    })
    await pmodel.save()
    res.redirect('home')
    
})
app.get('/:grade/:id',async(req,res)=>{
    const projectAr=await studentModel.find({
      grade:req.params.id
    })
    res.render('students',{projectAr})
})
app.post('/:grade/:id/addstudent',async(req,res)=>{
    const gradeId = req.params.id
    const gradeName=req.params.grade
    const studentName=req.body.name
    const studentIndex=req.body.id
   const student= new studentModel({
       name:studentName,
       index:studentIndex,
       grade:gradeId
    })
    await student.save()
    //console.log('asjkcnjkas')
    project=await projectModel.findById(gradeId)
   
    const updatedProject=await projectModel.findByIdAndUpdate(gradeId,{
        Total:project.Total+1
    })
    //console.log(updatedProject)
    res.redirect(`/${gradeName}/${gradeId}`)
})

app.listen(port,()=>{
    console.log(`sucessfully connected to ${port}`)
})

app.get('/distictyears',async(req,res)=>{
    try{
        const yearAr=await projectModel.distinct('year')
        console.log(yearAr)
        res.json(yearAr)
    }
    catch(e){
        console.log(e.message)
    }
})
app.post('/filterByYears',Auth,async(req,res)=>{
 const selectedYear=req.body.selectedYear
 console.log('selected year')
 console.log(selectedYear)
 const yearAr=await projectModel.distinct('year')
 const projectAr=await projectModel.find({year:selectedYear})
 res.render('home',{userName:req.user.userName,projectAr,yearAr,selectedYear})

})

mongoose.connect(db_url)
.then(()=>{console.log('sucessfully connected to mongodb server')})
.catch(e=>console.log(e.message))