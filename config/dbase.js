

const mongoose = require('mongoose')

const connectDb = async () => {
     try {
          const conn = await mongoose.connect('mongodb://localhost:27017/webDb')
          console.log(`Successfully connected to Mongodb`);
          
     }catch (error) {
          console.error(error)
     }
}


module.exports = connectDb