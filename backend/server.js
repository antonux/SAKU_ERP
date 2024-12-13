const client = require('./connection');
const cors = require('cors');
const express = require('express');
const app = express();
require('dotenv').config();

//routes
const productRoutes = require('./routes/product');
const supplierRoutes = require('./routes/supplier');

// middleware
app.use(cors()); // apply cors globally
app.use(express.json()); // middleware to parse JSON requests
app.use(express.urlencoded({ extended: true })); // parse incoming requests 

// listens to port
app.listen(process.env.PORT, ()=>{
    console.log(`Server is listening at port ${process.env.PORT}`);
})

client.connect();

// using routes
app.use('/api/product', productRoutes);
app.use('/api/supplier', supplierRoutes);