const express = require('express');
const { MongoServerClosedError } = require('mongodb');
const mongoose = require('mongoose');

const port = 3000;

mongoose.connect('mongodb://0.0.0.0/goodnight', {
    
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));

