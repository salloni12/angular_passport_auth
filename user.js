
var express=require('express');
var mongoose=require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var userSchema = new Schema({
   
    email: { type: String, required: true },
    password: { type: String }

    
  });
  
  var User =mongoose.model('User',userSchema);
  
  module.exports =User;