const mongoose = require('mongoose');
const validator = require('validator');

const departmentSchema = new mongoose.Schema({
    
    title:{
        type:String,
    },
    author:{
        type:String,
    },
    image:{
        type:String,
    },
    category:{
        type:String,
    },
    description:{
        type:String,
    },
       doctor:{
        type: Number,
    },
    token:{
        type:String,
        default:''
    }

});

const Department = mongoose.model('Department', departmentSchema);
module.exports = Department;