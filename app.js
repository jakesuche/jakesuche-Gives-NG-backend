const path = require('path');
const express= require('express');
const dotenv= require('dotenv')
const morgan = require('morgan');
const userRoutes= require('./api/routes/userRoutes');
const adminRoutes= require('./api/routes/adminRoutes');
const NGORoutes= require('./api/routes/NGORoutes')
const globalErrorHandler = require('./api/controllers/errorController');
const AppError = require('./api/utils/AppError');
const rateLimit= require('express-rate-limit');
const helmet= require('helmet');
const mongoSanitize= require('express-mongo-sanitize')
const xss= require('xss-clean');
const hpp= require('hpp')


dotenv.config()

const app= express();

app.use(helmet());

const limiter= rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many request from this IP.. try again in another hour'
})

app.use('/api', limiter)

app.use(express.json({limit: '10kb'}));

app.use(mongoSanitize())

app.use(xss());

app.use(hpp());

app.use(express.static(`${__dirname}/public`));

console.log(process.env.NODE_ENV);

if(process.env.NODE_ENV==='development'){
    app.use(morgan('dev'))
}

app.use((req, res, next)=>{
    console.log(`middleware is working`)
    next()
})

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/NGO', NGORoutes);

app.use('/', (req, res, next)=>{
    // res.sendFile(path.join(__dirname,'/public/intro.html'));
    res.status(200).render('/public/intro.html');
})



app.all('*', (req, res, next)=>{
    next(new AppError(`can't find ${req.originalUrl} on this server`))
})

app.use(globalErrorHandler);



module.exports= app;