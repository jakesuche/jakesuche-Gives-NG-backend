const mongoose= require('mongoose')
const validator= require('validator')
const bcrypt= require('bcrypt')
const jwt= require('jsonwebtoken')



const transactionSchema= new mongoose.Schema({
    project:{
        type: mongoose.Schema.ObjectId,
        ref:'Project',
    },
    userId:{
        type: mongoose.Schema.ObjectId,
        ref:'User',
        default: null
    },
    amount:{
        type: Number,
        default: 0
    },
    status:{
      type: String
    },
    reference:{
      type: String
    },
    access_code:{
      type: String
    }
})



const TransactionModel= mongoose.model('Transaction', transactionSchema);

module.exports= TransactionModel;