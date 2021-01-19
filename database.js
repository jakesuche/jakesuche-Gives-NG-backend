const mongoose= require('mongoose');


const connection= ()=>{
    // insert the password into the db link
    const DB= process.env.DATABASE.replace('<PASSWORD>', process.env.PASSWORD)


    // connecting to our database using mongoose
    if(process.env.NODE_ENV === 'production'){
        mongoose.connect(DB, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
        }).then((conn)=>{
            console.log(`connecting to online db successful`)
        }).catch((err)=>{
            console.log(`connecting to online db unsuccessful`)
        })
    }
    else{
        mongoose.connect(process.env.DATABASE_LOCAL, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
        }).then((conn)=>{
            console.log(`connecting to local db  successful`)
        }).catch((err)=>{
            console.log(`connecting to local db  unsuccessful`)
        })
    }

}


module.exports= connection;