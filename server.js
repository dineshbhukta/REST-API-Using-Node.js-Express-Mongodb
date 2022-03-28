const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
require('dotenv').config();
const PORT = Number(5000);
const fileUpload = require('express-fileupload');

const db_prod = process.env.MONGO_PROD || require('./config.json').config.db_prod;
const db_dev = process.env.MONGO_DEV || require('./config.json').config.db_dev;

//make it executable
const app = express();

app.use(express.json());
//to hide the extensions from theft means no one can able to find in which fromat you are wrote the code in urlewncoded fromat
app.use(express.urlencoded({extended:false})); 

app.use(cors());
app.use(cookieParser());

//fileupload
app.use(fileUpload({
    useTempFiles:true
}));

mongoose.Promise = global.Promise;
mongoose.connect(db_prod , (err) => {
    if(err) throw err;
    console.log('mongodb connected')
})

app.use('/auth',require('./route/userRoute'));
app.use('/api', require('./route/productRoute'));
app.use('/api', require('./route/imageRoute'));

app.listen(PORT, () => {
    console.log(`server is running @ http://localhost:${PORT}`);
});
