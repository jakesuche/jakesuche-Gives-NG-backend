const mongoose= require('mongoose')
const validator= require('validator')
const bcrypt= require('bcrypt')
const jwt= require('jsonwebtoken')



const NGOSchema= new mongoose.Schema({
    name:{
        type: String
    },
    email:{
        type: String,
        required: [true, 'email cannot be empty'],
        lowercase: true,
        unique: true,
        validate:[validator.isEmail, 'please type a correct email']
    },
    password:{
        type: String,
        required: [true, 'password cannot be empty'],
        minlength: 8,
        select: false
    },
    role:{
        type: String
    },
    status: {
        type: String,
        enum: ['active','suspend'],
        default: 'active'
    },
    CaCNumber:{
        type: Number
    }
})


// generate jwt token
NGOSchema.methods.signinToken= function(id){
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

// bcrypt password encryption/ hashing
NGOSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    this.password= await bcrypt.hash(this.password, 12);
    next();
})


// compare bcrypt hashed passwords
NGOSchema.methods.comparePassword= async function(userPassword, dbPassword){
    return await bcrypt.compare(userPassword, dbPassword)
}

// check if password was changed after issuing the jwt
// NGOSchema.methods.changedPasswordAfter= async function(Jwt){

// }


// a query / find middleware
// NGOSchema.pre(/^find/, function(next){
//     // find query that are active
//     this.find({status: {$ne: 'suspend'}})
//     next()
// })



const NGOModel= mongoose.model('Admin', NGOSchema)



module.exports= NGOModel;