var express = require('express');

var app = express();

var server = app.listen(3000, () => {
    console.log('server is running on port', server.address().port);
   });

app.use(express.static(__dirname));

var mongoose = require('mongoose');

var dbUrl = 'mongodb+srv://username:password@ds257981.mongodb.net:57981/simple-chat'

mongoose.connect(dbUrl , (err) => { 
    console.log('mongodb connected',err);
 })

var Message = mongoose.model('Message',{ name : String, message : String})

