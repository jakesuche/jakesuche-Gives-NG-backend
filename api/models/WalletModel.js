const mongoose= require('mongoose')
const validator= require('validator')
const bcrypt= require('bcrypt')
const jwt= require('jsonwebtoken')



const walletSchema= new mongoose.Schema({
    user:{
        type: mongoose.Schema.ObjectId,
        ref:'User',
        default: null
    },
    Balance:{
        type: Number,
        default: 0
    },
    accountNumber:{
        type: String
    }
})

const WalletModel= mongoose.model('Wallet', walletSchema);

module.exports= WalletModel;