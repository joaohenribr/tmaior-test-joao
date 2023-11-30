var express = require('express');
var app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}))

var server = app.listen(3000, () => {
    console.log('server is running on port', server.address().port);
});

app.use(express.static(__dirname));

var mongoose = require('mongoose');
var dbUrl = 'mongodb+srv://admin:EJwLcbTY1znnVu00@cluster0.dpjsz7z.mongodb.net/?retryWrites=true&w=majority'

mongoose
    .connect(dbUrl)
    .then((success) => console.log('Conectado ao MongoDB com sucesso'))
    .catch((err) => console.log('Erro ao conectar ao MongoDB', err));

var Message = mongoose.model('Message',{ name : String, message : String})

app.get('/messages', (req, res) => {
    Message.find({},(err, messages)=> {
        res.send(messages);
    })
})

app.post('/messages', (req, res) => {
    var message = new Message(req.body);
    message.save((err) =>{
        if(err)
            sendStatus(500);
        res.sendStatus(200);
    })
})
