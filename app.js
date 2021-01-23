const path = require('path');
const express= require('express');
const dotenv= require('dotenv')
const morgan = require('morgan');
const rateLimit= require('express-rate-limit');
const helmet= require('helmet');
const mongoSanitize= require('express-mongo-sanitize')
const xss= require('xss-clean');
const hpp= require('hpp')
const cookieParser= require('cookie-parser')
const cors= require('cors')

const userRoutes= require('./api/routes/userRoutes');
const projectRoutes= require('./api/routes/projectRoutes')
const walletRoutes= require('./api/routes/walletRoutes')
const globalErrorHandler = require('./api/controllers/errorController');
const AppError = require('./api/utils/AppError');



dotenv.config()

const app= express();


//CORS
app.use(cors());

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, OPTIONS, PUT, PATCH, DELETE'
    );
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Authorization, Origin, Content-Type, Accept'
    );
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(helmet());

const limiter= rateLimit({
    max: 10000,
    windowMs: 60 * 60 * 1000,
    message: 'Too many request from this IP.. try again in another hour'
})

app.use('/api', limiter)

app.use(express.json({limit: '10kb'}));

app.use(cookieParser())

app.use(express.urlencoded({extended: false}));

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
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/wallets', walletRoutes);


app.use('/', (req, res, next)=>{
    res.sendFile(path.join(__dirname,'/public/intro.html'));
})



app.all('*', (req, res, next)=>{
    next(new AppError(`can't find ${req.originalUrl} on this server`))
})

app.use(globalErrorHandler);



module.exports= app;