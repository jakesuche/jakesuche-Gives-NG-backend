const app= require('./app')
const dbconnection= require('./database')



// calling the database
dbconnection()

//listening to port 
const port= parseInt(process.env.PORT) || 3000;

// listening to port

app.listen(port, ()=>{
    console.log(`listening at port ${port}`)
})