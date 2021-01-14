const { promisify }= require('util')
const jwt= require('jsonwebtoken');
const catchAsync= require('../utils/catchAsync')
const AppError= require('../utils/AppError');
const TemplateAPIMethods= require("./TemplateAPIMethods")
const request= require('request')
const {initializePayment, verifyPayment} = require('../utils/paystack')(request);
var paystack = require('paystack')('secret_key');
const crypto= require('crypto');
const Transaction = require('../models/TransactionsModel')
const Project = require('../models/projectModel');
const Wallet= require('../models/WalletModel')





const filterObj=(obj, ...allowedFields)=>{
    const newObj={}
    Object.keys(obj).forEach((el)=>{
        if(allowedFields.includes(el)) newObj[el]= obj[el]
    })
    return newObj;
}


exports.createProject= catchAsync(async(req, res, next)=>{
    const {project, amount, description, image }= req.body

    if(!project || !amount || !description ){
        return next(new AppError(`incomplete fields.. please insert the values`, 401))
    }

    const newProject= await Project.create({
        project,
        amount,
        description,
        image,
        projectCreatedBy: req.body.projectCreatedBy
    })

    res.status(201).json({
        status:'success',
        data:{
            project: newProject
        }
    })

})

exports.Initializedonation= catchAsync(async(req, res, next)=>{

    // filter out important details to send like the price and amount details
    const filteredBody= filterObj(req.body, 'amount','email','full_name')

    // find the wallet of the user
    let wallet= await Wallet.findOne({user: req.user._id});

    if(!wallet){
        return next(new AppError(`the wallet belonging to the user cannot be found`, 404))
    }

    // check balance in wallet if is greater than the amount to be donated
    if(wallet.Balance < filteredBody.amount){
        return next(new AppError(`your balance isn't sufficient for donation`, 401))
    }


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

exports.verifyDonation= catchAsync(async(req, res, next)=>{
    // obtaining reference of the redirect to verify payment/funding user wallet
    const ref = req.query.reference;

    verifyPayment(ref, async(error,body)=>{
        if(error){
            //handle errors appropriately
            console.log(error)
            return next(new AppError(`Verifying Payment was Unsuccessful`, 401))
        }

        let response = JSON.parse(body);     
        console.log(response)  

        // reflect the payment on the project
        await Project.findByIdAndUpdate(req.params.id, {
            // update the project
        },{
            new: true
        })
        
        // update the wallet with the new balance
        let wallet= await Wallet.findByIdAndUpdate(req.user._id, {
            // Balance: 
        },{
            new: true
        });



        res.status(200).json({
            status:'success',
            data:{
                message:'you have paid successfully',
                response
            }
        })
    })
})

exports.donateToProjectAnonymous= catchAsync(async(req, res, next)=>{
    
})








//Admin Privileges

exports.findProjects= TemplateAPIMethods.getAll(Project)

exports.findAProject= TemplateAPIMethods.getOne(Project)

exports.updateProject= TemplateAPIMethods.updateOne(Project)

exports.deleteProject= TemplateAPIMethods.deleteOne(Project)

exports.approveProject= catchAsync(async(req, res, next)=>{

    // check to see if project is already approved
    let doc= await Project.findOne({_id: req.params.id }, {approved: false});

    if(!doc){
        return next(new AppError(`this project has already been approved`, 401));
    }

    doc = await Project.findByIdAndUpdate(req.params.id, {approved: true}, {
        new: true
    });
    

    res.status(200).json({
        status:'success',
        data:{
            doc
        }
    })
})

