const express = require('express');//HTTP Routes Framework
const morgan = require('morgan');//It is a middleware. It simplifies 
const bodyParser = require('body-parser');//The way nodejs understand the outside data which interacts with the app 
const mongoose = require('mongoose');//To connect the application with the MONGODB Databases
const cors = require('cors');

const config = require('./config');//Export the local file of the Database Configuration

const app = express();

mongoose.connect(config.database, (err) =>{
	if(err) { console.log(err);}
	else { console.log('Connected to the database');}
});

app.use(bodyParser.json());//Reading data in specific format. (In this case JSON data)
app.use(bodyParser.urlencoded({ extended: false }));// It can read all source of data types
app.use(morgan('dev'));//
app.use(cors());//Cross Origin Resource Sharing

/**********************(Routes)**************************/ 
const userRoutes = require('./routes/account');
const mainRoutes = require('./routes/main');
const sellerRoutes = require('./routes/seller');

app.use('/api', mainRoutes);
app.use('/api/accounts', userRoutes);
app.use('/api/seller', sellerRoutes);


app.listen(config.port, err =>{
	console.log("Magic happens on port awesome "+ config.port);
});
