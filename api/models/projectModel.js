const mongoose= require('mongoose')
const validator= require('validator')
const bcrypt= require('bcrypt')
const jwt= require('jsonwebtoken')



const projectSchema= new mongoose.Schema({
    project:{
        type: String,
        required: [true, 'project cannot be empty']
    },
    description:{
        type: String,
        required: [true, 'description cannot be empty']
    },
    image:{
        type: String
    },
    status:{
        type: String,
        enum:['ongoing', 'completed']
    },
    approved:{
        type: Boolean,
        default: false
    },
    ProjectCreatedBy:{
        type: mongoose.Schema.ObjectId,
        ref:'User'
    },
    ProjectAcceptedBy:{
        type: mongoose.Schema.ObjectId,
        ref:'NGO'
    },
    Amount:{
        type: Number,
        default: 0
    },
    signedUpDonators:{
        type: mongoose.Schema.ObjectId,
        ref:'User'
    },
    AnonymousDonators:{
        type: String
    }
})



const ProjectModel= mongoose.model('Project', projectSchema);

module.exports= ProjectModel;