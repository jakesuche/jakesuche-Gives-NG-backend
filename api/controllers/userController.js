const { promisify }= require('util')
const jwt= require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync= require('../utils/catchAsync')
const AppError= require('../utils/AppError');
const TemplateAPIMethods= require("./TemplateAPIMethods")
const request= require('request')
const {initializePayment, verifyPayment} = require('../utils/paystack')(request);
var paystack = require('paystack')('secret_key');
const crypto= require('crypto');
const Transaction = require('../models/TransactionsModel')



// to filter object for update user
const filterObj=(obj, ...allowedFields)=>{
    const newObj={}
    Object.keys(obj).forEach((el)=>{
        if(allowedFields.includes(el)) newObj[el]= obj[el]
    })
    return newObj;
}


//USER ROUTES

exports.getMe= (req, res, next)=>{
    // authenticate the route
    if(!req.user) return next(new AppError(`you need to be authenticated in order to view this!`, 401));
    req.params.id= req.user.id;
    next()
}

exports.getUser= catchAsync(async(req,res, next)=>{
    const user= await User.findById(req.user.id).select('-role')

    res.status(200).json({
        status:'success',
        data:{
            user
        }
    })
})

exports.updateMe= catchAsync(async(req,res, next)=>{
    const filteredBody= filterObj(req.body, 'name', 'email')

    const user= await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    });
    

    res.status(200).json({
        status:'success',
        data:{
            user
        }
    })
})

exports.deleteMe= catchAsync(async(req,res, next)=>{
    const user= await User.findByIdAndUpdate(req.user.id, {active: false});

    res.status(204).json({
        status:'success',
        data:{
            user
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
    paystack_data.metadata= filteredBody.full_name;

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

        // if (response) res.redirect(301, response.data.authorization_url);

        if (response){
            res.status(200).json({
                status:'success',
                data:{
                    url: response.data.authorization_url
                }
            })
        }

    });

})




exports.verifyUserFundingWallet= catchAsync(async(req, res, next)=>{

    // obtaining reference of the redirect to verify payment/funding user wallet
    const ref = req.query.reference;

    verifyPayment(ref, async(error,body)=>{
        if(error){
            //handle errors appropriately
            console.log(error)
            return next(new AppError(`Verifying Payment was Unsuccessful`, 401))
        }

        response = JSON.parse(body);     
        console.log(response)   

        // const data = _.at(response.data, ['reference', 'amount','customer.email', 'metadata.full_name']);

        // let { status, ip_address, reference, currency, channel } = payment_status.data.data;


        // fund the user wallet only if the transaction status is success
        if (status == "success") {

            // if the payment was successfull, increase the user's balance with the added amount. the default
            // amount in a user's account is 0
            // await User.updateOne({ _id: req.user.id }, { $inc: { balance: transaction_id.amount } });


            //update Transaction payload
            // await Transaction.updateOne({ _id: req.user.id }, {status: "success"});


            // create a notfication for the user that a money has been credited into their account
            // let notification_payload = {
            //     receiverId: req.user.id,
            //     content: `₦${transaction_id.amount
            //         .toFixed(2)
            //         .replace(/\d(?=(\d{3})+\.)/g, "$&,")} has been deposited into your Wallet!.`,
            // };

           // add the notification to the notification/transaction model
            // await Notification.create(notification_payload);


            // send a sucessful response or redirect user to dashboard

            // req.flash(
            // "success_msg",
            // "Transaction Successfull. The amount of " +
            //     transaction_id.amount +
            //     " has been funded in your wallet",
            // );

            // return res.redirect("/user/dashboard");


        } else {
            // req.flash("success_msg", "Transaction Unsuccessfull");
            // return res.redirect("/user/dashboard");
        }
        
    })
})




 exports.userSendMoney= catchAsync(async(req, res, next)=>{

    // search the database for the user either with the email or the virtal account id, skip the logged in userId (sender ID)

    const { amount, recepient, transaction_remark } = req.body;

        // let receiver = await User.findOne({
        //     _id: { $ne: req.user.id },
        //     $or: [{ email: recepient }, { virtual_account_id: recepient }],
        // }); 


        // if not user/ reciever of the payment was found, send a message back
        // if (!receiver) {
        //     req.flash("success_msg", "The Receiver's account was not found, You can try again.");
        //     return res.redirect("back");
        // }

        // if user was found, check if the sender has up to the amount they want to transfer in their account/wallet
        const user_has_enough_balance = req.user.balance >= parseInt(amount);

    // if user has enough balance, make the transfer, Update the sender's balance else, send a message back to the user
    if (user_has_enough_balance) {


        // await Wallet.create({
        //     senderId: req.user.id,
        //     receiverId: receiver._id,
        //     amount: parseInt(amount),
        //     transaction_remark,
        // });

    
        // let sender_current_balance = await User.findById(req.user.id);

        // Update the Sender's balance
        // await User.updateOne(
        //   { _id: req.user.id },
        //   { $set: { balance: sender_current_balance.balance - parseInt(amount) } },
        // );

        // Update the Receiver's balance
        // await User.updateOne({ _id: receiver._id }, { $inc: { balance: parseInt(amount) } });



        // send a notification to the receiver that they have been gifted money, incase they see an additional money in their wallet balance.

        // let notification_payload = {
        //     receiverId: receiver._id,
        //     content: `₦${parseInt(amount)
        //     .toFixed(2)
        //     .replace(/\d(?=(\d{3})+\.)/g, "$&,")} has been sent to you as a gift from ${
        //     sender_current_balance.full_name
        //     }`,
        // };

        // add it to the notification model
        // await Notification.create(notification_payload);



    }else {
        req.flash(
          "success_msg",
          "Insufficient funds. You don't have enough money in your wallet to make this transfer. Try funding your wallet to continue",
        );
        // return res.redirect("back");
    }

 })






//ADMIN USER PREMISSION ROUTES
exports.getAllUsers= TemplateAPIMethods.getAll(User);

exports.getUser= TemplateAPIMethods.getOne(User);

// DO NOT CHANGE THE USER'S PASSWORD(ADMIN)
exports.updateUser= TemplateAPIMethods.updateOne(User)

exports.deleteUser= TemplateAPIMethods.deleteOne(User);



