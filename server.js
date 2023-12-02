var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');
var bodyParser = require('body-parser')

app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.use(express.static(__dirname));

var server = http.listen(3000, () => {
    console.log('server is running on port', server.address().port);
});

var dbUrl = 'mongodb+srv://admin:EJwLcbTY1znnVu00@cluster0.dpjsz7z.mongodb.net/?retryWrites=true&w=majority'

mongoose
    .connect(dbUrl)
    .then((success) => console.log('Conectado ao MongoDB com sucesso'))
    .catch((err) => console.log('Erro ao conectar ao MongoDB', err));

var Message = mongoose.model('Message',{ name : String, message : String})

app.get('/messages', (req, res) => {
    Message.find({})
    .then((messages) => {
        res.send(messages);
    })
    .catch((err) => {
        console.log(err);
    });
})

app.get('/messages/:user', (req, res) => {
    var user = req.params.user
    Message.find({name: user},(err, messages)=> {
      res.send(messages);
    })
})

app.post('/messages', async (req, res) => {
    try{
      var message = new Message(req.body);
  
      var savedMessage = await message.save()
        console.log('saved');
  
      var censored = await Message.findOne({message:'badword'});
        if(censored)
          await Message.remove({_id: censored.id})
        else
          io.emit('message', req.body);
        res.sendStatus(200);
    }
    catch (error){
      res.sendStatus(500);
      return console.log('error',error);
    }
    finally{
      console.log('Message Posted')
    }
  
  })

io.on('connection', () =>{
    console.log('a user is connected')
})