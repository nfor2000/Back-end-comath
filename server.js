const express = require('express'),
     cors = require('cors'),
     bodyParser = require('body-parser'),
     connectDb = require('./config/dbase')
require('dotenv').config()
const path = require('path')


const {errorHandler} = require('./middleware/errorMiddleware')
const app = express();
// MongoDB Configuration
connectDb()
const port = process.env.PORT || 4444;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


app.use('/public', express.static('public'));
app.use(errorHandler);
app.use('/user', require('./routes/user.routes') )
app.use('/teacher', require('./routes/teachers.routes'))
app.use('/content', require('./routes/content.routes'))
app.use('/contact/', require('./routes/send-email.routes'))



app.listen(port, () => {
     console.log('Connected to port ' + port)
 })


 