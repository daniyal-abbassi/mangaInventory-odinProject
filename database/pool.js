require('dotenv').config();
const Pool = require('pg').Pool;
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
})


pool.on('error', (error, client) => {
    console.error(`Unexpected error on connection: ${error}`)
})

pool.connect()
    .then(() => console.log("Database connected successfully!!!"))
    .catch(err => console.error(`Database connection error: ${err}`))


module.exports = pool;