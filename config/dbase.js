

const mongoose = require('mongoose')
require('dotenv').config()

const connectDb = async () => {
     try {
          const conn = await mongoose.connect(process.env.MONGODB_URI)
          console.log(`Successfully connected to Mongodb`);
          
     }catch (error) {
          console.error(error)
     }
}


module.exports = connectDb