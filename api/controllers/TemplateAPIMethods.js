const catchAsync = require("../utils/catchAsync");
const ApiFeatures= require("../utils/APIFeatures");
const AppError = require("../utils/AppError");



exports.getAll= Model => catchAsync(async(req, res, next)=>{
    console.log(req.requestTime);

    // FOR WANTING TO FILTER REVIEWS BASED ON SOME PARAMETERS(FROM NESTED ROUTES)
    let filter={}
    // if(req.params.tourId) filter= {tour: req.params.tourId}


    //API Features
    const features= new ApiFeatures(Model.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate()


    // fetch the Tours from the db using the models. 
    const docs= await features.Model;
    
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        Result: docs.length,
        data:{
            docs
        }
    })
})

exports.getOne= (Model, populateOptions) => catchAsync(async(req, res, next)=>{
    // this selectively adds the populate object and its options
    let query= Model.findById(req.params.id);
    if(populateOptions) query= query.populate(populateOptions);

    // fetching a single tour from db
    const doc= await query;

    if(!doc){
        return next(new AppError(`no document found with this ID`, 404))
    }

    res.status(200).json({
        status:'success',
        data:{
            doc
        }
    })
})

exports.deleteOne= Model => catchAsync(async(req, res, next)=>{
    const doc= await Model.findByIdAndDelete(req.params.id);

    if(!doc){
        return next(new AppError(`no document found with this ID`, 404))
    }

    res.status(204).json({
        status:'success',
        data: null
    })
})

exports.updateOne= Model=> catchAsync(async(req, res, next)=>{
    const doc= await Model.findByIdAndUpdate(req.body)

    if(!doc){
        return next(new AppError(`no document found with this ID`, 404))
        }

    res.status(200).json({
        status:'success',
        data:{
            doc
        }
    })
})


exports.createOne= Model => catchAsync(async(req, res, next)=>{
    // creating a tour using another way 
    const doc= await Model.create(req.body);
    res.status(201).json({
        status:'success',
        data:{
            doc
        }
    })
})