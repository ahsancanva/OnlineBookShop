require('dotenv').config()
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');

const path = require('path');
const app = express();
const port = process.env.PORT || 3000

// import the external files
const connection = require('./connection');
const connectDB = require('./connection');
// import the user_router file
const routs = require('./routs/routs');
const router = require('./routs/routs');
app.use('/',router);  

// import the admin_router file
const admin_routs = require('./routs/admin_routs');
const adminRout = require('./routs/admin_routs');
app.use('/admin',adminRout);



// service the static foleder
app.use(express.static(path.join(__dirname, 'static'))); 

connectDB().then(()=>{
    app.listen(port, () => {
        console.log(`Example app listening on port  http://localhost:${port}`);
    });
})
