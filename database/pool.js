require('dotenv').config();
const Pool = require('pg').Pool;
const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE
})


pool.on('error',(error, client)=>{
    console.error(`Unexpected error on connection: ${error}`)
})

pool.connect()
    .then(()=> console.log("Database connected successfully!!!"))
    .catch(err=>console.error(`Database connection error: ${err}`))


module.exports=pool;