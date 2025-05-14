// const { Pool } = require('pg');
// const pool = new Pool({
//     user: 'postgres',
//     host: 'localhost', // Adjust if connecting to a remote server
//     database: 'linkstand',
//     password: 'admin',
//     port: 5432,  
// });
// pool.query('SET TIMEZONE = \'Asia/Kolkata\';')
//   .then(() => console.log('Timezone set to Asia/Kolkata'))
//   .catch((err) => console.error('Error setting timezone', err));

// module.exports=pool

require('dotenv').config();
const Pool = require("pg").Pool;


const pool = new Pool({  
  connectionString: process.env.DATABASE_URL,

  ssl: {
    rejectUnauthorized: false, 
  },
  
  });
  console.log("Database URL:", process.env.DATABASE_URL);

  module.exports = pool;