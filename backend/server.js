const client = require('./connection');
const cors = require('cors');
const express = require('express');
const app = express();
require('dotenv').config();

//routes
const productRoutes = require('./routes/product');
const supplierRoutes = require('./routes/supplier');
const userRoutes = require('./routes/userRoutes');
const requestRoutes = require('./routes/requestRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// middleware
app.use(cors()); // apply cors globally
app.use(express.json()); // middleware to parse JSON requests
app.use(express.urlencoded({ extended: true })); // parse incoming requests 

// listens to port
app.listen(process.env.PORT, () => {
    console.log(`Server is listening at port ${process.env.PORT}`);
})

client.connect();

// to fetch the uploaded photos
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// using routes
app.use('/api/product', productRoutes);
app.use('/api/supplier', supplierRoutes);
app.use('/api/users', userRoutes);
app.use('/api/request', requestRoutes);
app.use('/api/purchase', purchaseRoutes);
app.use('/api/notification', notificationRoutes);