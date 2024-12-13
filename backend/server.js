const client = require('./connection');
const cors = require('cors');
const express = require('express');
const app = express();
require('dotenv').config();

//routes
const productRoutes = require('./routes/product');

// middleware
app.use(cors()); // Apply CORS globally
app.use(express.json()); // Middleware to parse JSON requests

app.use(express.urlencoded({ extended: true }));

app.listen(process.env.PORT, ()=>{
    console.log("Server is now listening at port");
})

client.connect();

// using routes
app.use('/api/product', productRoutes);