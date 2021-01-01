const crypto= require('crypto')
const mongoose= require('mongoose')
const validator= require('validator')
const bcrypt= require('bcrypt')
const jwt= require('jsonwebtoken')



const adminSchema= new mongoose.Schema({
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
        default: 'suspend'
    },
    apiKey: {
        type: String
    }, 
    passwordChangedAt: {
        type: Date
    },
    PasswordResetToken:{
        type: String
    },
    PasswordResetExpires:{
        type: Date
    }
})


// generate jwt token
adminSchema.methods.signinToken= function(id){
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

// bcrypt password encryption/ hashing
adminSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    this.password= await bcrypt.hash(this.password, 12);
    next();
})


// compare bcrypt hashed passwords
adminSchema.methods.comparePassword= async function(userPassword, dbPassword){
    return await bcrypt.compare(userPassword, dbPassword)
}

// check if password has been changed before or after issuing JWTtimestamp
adminSchema.methods.changedPasswordAfter= function(JWTTimestamp){
    if(this.passwordChangedAt){
        const changedTimestamp= parseInt(this.passwordChangedAt.getTime()/100, 10)
        console.log(this.passwordChangedAt, JWTTimestamp)
        return JWTTimestamp < changedTimestamp;
    }

    return false
}

// creating the password reset token using the schema
adminSchema.methods.createPasswordResetToken= function(){
    const resetToken= crypto.randomBytes(32).toString('hex');
    
    this.PasswordResetToken= crypto.createHash('sha256').update(resetToken).digest('hex');

    this.PasswordResetExpires= Date.now() * 10 * 60 * 1000;

    return resetToken;
}

// a query / find middleware
adminSchema.pre(/^find/, function(next){
    // find query that are not suspended
    this.find({status: {$ne: 'suspend'}})
    next()
})



const adminModel= mongoose.model('Admin', adminSchema)



module.exports= adminModel;