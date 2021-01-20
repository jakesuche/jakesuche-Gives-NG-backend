const crypto= require('crypto')
const mongoose= require('mongoose')
const validator= require('validator')
const bcrypt= require('bcrypt')
const jwt= require('jsonwebtoken')



const NGOSchema= new mongoose.Schema({
    status: {
        type: String,
        enum: ['active','suspend'],
        default: 'active'
    },
    CaCNumber:{
        type: Number
    },
    organization:{
        type: String
    },
    phoneNumber:{
        type: Number
    },
    address:{
        type: String
    },
    LGA:{
        type: String
    },
    NGODescription:{
        type: String
    }
})

const NGOModel= mongoose.model('NGO', NGOSchema)

module.exports= NGOModel;