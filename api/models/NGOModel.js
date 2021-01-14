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

// check if password has been changed before or after issuing JWTtimestamp
NGOSchema.methods.changedPasswordAfter= function(JWTTimestamp){
    if(this.passwordChangedAt){
        const changedTimestamp= parseInt(this.passwordChangedAt.getTime()/100, 10)
        console.log(this.passwordChangedAt, JWTTimestamp)
        return JWTTimestamp < changedTimestamp;
    }

    return false
}

// creating the password reset token using the schema
NGOSchema.methods.createPasswordResetToken= function(){
    const resetToken= crypto.randomBytes(32).toString('hex');
    
    this.PasswordResetToken= crypto.createHash('sha256').update(resetToken).digest('hex');

    this.PasswordResetExpires= Date.now() * 10 * 60 * 1000;

    return resetToken;
}

// a query / find middleware
NGOSchema.pre(/^find/, function(next){
    // find query that are active
    this.find({status: {$ne: 'suspend'}})
    next()
})



const NGOModel= mongoose.model('NGO', NGOSchema)



module.exports= NGOModel;