const mongoose=require('mongoose')
const studentSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    index:{
        type:String,
        required:true,
    },
    grade:{
        required:true,
        type:mongoose.Schema.Types.ObjectId,
        ref:'grades'
    }
})
studentSchema.index({ index: 1, grade: 1 }, { unique: true });
module.exports=mongoose.model('student',studentSchema)