const mongoose= require('mongoose')
const validator= require('validator')
const bcrypt= require('bcrypt')
const jwt= require('jsonwebtoken')



const transactionSchema= new mongoose.Schema({
    project:{
        type: String
    },
    AuthorizationCode:{
        type: Number
    },
    Sender:{
        type: mongoose.Schema.ObjectId,
        ref:'NGO',
        default: null
    },
    Reciever:{
        type: mongoose.Schema.ObjectId,
        ref:'User',
        default: null
    },
    AmountSent:{
        type: Number,
        default: 0
    },
    imageOfProject:{
        type: String
    }
})



const TransactionModel= mongoose.model('Transaction', transactionSchema);

module.exports= TransactionModel;