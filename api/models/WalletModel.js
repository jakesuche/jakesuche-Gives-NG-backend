const mongoose= require('mongoose')
const validator= require('validator')
const bcrypt= require('bcrypt')
const jwt= require('jsonwebtoken')



const walletSchema= new mongoose.Schema({
    project:{
        type: String
    },
    user:{
        type: mongoose.Schema.ObjectId,
        ref:'User',
        default: null
    },
    NGO:{
        type: mongoose.Schema.ObjectId,
        ref:'NGO',
        default: null
    },
    Balance:{
        type: Number,
        default: 0
    }
})



const WalletModel= mongoose.model('Wallet', walletSchema);

module.exports= WalletModel;