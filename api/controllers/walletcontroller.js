const Wallet= require('../models/WalletModel')
const catchAsync= require('../utils/catchAsync')
const AppError= require('../utils/AppError');
const TemplateAPIMethods= require("./TemplateAPIMethods")
const request= require('request')
const {initializePayment, verifyPayment} = require('../utils/paystack')(request);
var paystack = require('paystack')('secret_key');
const crypto= require('crypto');
const Transaction = require('../models/TransactionsModel')





//USER ROUTES


// to filter object for update user
const filterObj=(obj, ...allowedFields)=>{
    const newObj={}
    Object.keys(obj).forEach((el)=>{
        if(allowedFields.includes(el)) newObj[el]= obj[el]
    })
    return newObj;
}

exports.getMyWallet= catchAsync(async(req, res, next)=>{
    const wallet= await Wallet.findOne({user: req.user._id})
    res.status(200).json({
        status:'success',
        data:{
            wallet
        }
    })
})



exports.FundUserWallet= catchAsync(async(req, res, next)=>{

    // filter out important details to send like the price and amount details
    const filteredBody= filterObj(req.body, 'amount','email','full_name')

    // payload to send to paystack to initialize a transaction
    const paystack_data = {
        // amount: parseInt(req.body.amount) * 100,
        amount: parseInt(filteredBody.amount) * 100,
        email: req.user.email,
        reference: crypto.randomBytes(4).toString("hex"),
    };

    // add the full name of the user to metadata
    // paystack_data.metadata= filteredBody.full_name;

    // call the paystack endpoint for initializing the payment
    initializePayment(paystack_data, async(error, body)=>{
        if(error){
            //handle errors
            console.log(error);
            return next(new AppError(`Initializing Payment was Unsuccessful`, 401))
        }

        // the paystack body sent back is then saved as a response variable
        let response = JSON.parse(body);
        console.log(response);
        
        //save the the transaction in the transaction model.
        let transation_payload = {
            userId: req.user.id,
            amount: parseInt(req.body.amount),
            status: "pending",
            reference: paystack_data.reference,
            access_code: response.data.access_code,
        };

        await Transaction.create(transation_payload);

        if (response){
            res.status(200).json({
                status:'success',
                data:{
                    url: response.data.authorization_url
                    // url: response
                }
            })
        }

        // if (response) res.redirect(301, response.data.authorization_url);

    });

})


exports.verifyUserFundingWallet= catchAsync(async(req, res, next)=>{

    // obtaining reference of the redirect to verify payment/funding user wallet
    const ref = req.query.reference;

    verifyPayment(ref, async(error, body)=>{
        if(error){
            //handle errors appropriately
            console.log(error)
            return next(new AppError(`Verifying Payment was Unsuccessful`, 401))
        }

        // the response
        let response = JSON.parse(body);     
        console.log(response)  

        // data from the body
        let { status, ip_address, reference, currency, channel } = response.data.data;
        
        // update the transaction 
        await Transaction.updateOne(
            { userId: req.user.id, reference },
            { $set: { status }, ip_address, reference, currency, channel },
        );

        if (response.status == "success") {

            // find user with reference
            let transaction_id = await Transaction.findOne({ userId: req.user.id, reference });
            
            // update the wallet
            await Wallet.updateOne({ _id: req.user.id }, { $inc: { balance: transaction_id.amount } });
        }
 
        res.status(200).json({
            status:'success',
            data:{
                message:'you have paid successfully',
                response
            }
        })
    })
})





 exports.userSendMoney= catchAsync(async(req, res, next)=>{
    
 })



 // ADMIN CONTROLLERS


exports.getAllWallet= catchAsync(async(req, res, next)=>{

    const wallets= await Wallet.find()
    res.status(200).json({
        status:'success',
        data:{
            wallets
        }
    })
})

exports.getWallet= catchAsync(async(req, res, next)=>{
    const wallet= await Wallet.findById(req.params.id)
    res.status(200).json({
        status:'success',
        data:{
            wallet
        }
    })
})

