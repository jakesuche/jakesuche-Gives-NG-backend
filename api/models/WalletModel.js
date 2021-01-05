const mongoose= require('mongoose')
const validator= require('validator')
const bcrypt= require('bcrypt')
const jwt= require('jsonwebtoken')



const walletSchemaUser= new mongoose.Schema({
    user:{
        type: mongoose.Schema.ObjectId,
        ref:'User',
        default: null
    },
    Balance:{
        type: Number,
        default: 0
    }
})

const walletSchemaNGO= new mongoose.Schema({
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




const WalletModelUser= mongoose.model('WalletUser', walletSchemaUser);
const WalletModelNGO= mongoose.model('WalletNGO', walletSchemaNGO);

module.exports={
    WalletModelUser,
    WalletModelNGO
}