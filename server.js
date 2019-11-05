const express = require('express'),
http = require('http'),
app = express(),
server = http.createServer(app),
io = require('socket.io').listen(server);
app.get('/', (req, res) => {

res.send('Chat Server is running on port 8448')
});

var ioSC = require('socket.io-client');
var socketSC = ioSC.connect("http://192.168.0.100:3000/", {
    reconnection: true
});

socketSC.on('connect', function () {
    console.log('connected to localhost:3000');
    socketSC.emit('join',"server 0bdj78")
});


io.on('connection', (socket) => {

console.log('user connected')

socket.on('join', function(userNickname) {

        console.log(userNickname +" : has joined the chat "  );

        socket.broadcast.emit('userjoinedthechat',userNickname +" : has joined the chat ");
    });


socket.on('messagedetection', (senderNickname,messageContent,type) => {
       
       //log the message in console 

       console.log(senderNickname+" :" +messageContent+": "+type)
        //create a message object 
       let  message = {"message":messageContent, "senderNickname":senderNickname}
          // send the message to the client side  
       io.emit('message', message );
        
       if(type == "decen"){
        console.log("type"+": "+type)
          socketSC.emit('messagedetection',senderNickname,messageContent)
        }
       
     
      });
      
  
 socket.on('disconnect', function() {
    console.log( ' user has left ')
    socket.broadcast.emit("userdisconnect"," user has left ") 

});



});





server.listen(8448,()=>{

console.log('Node app is running on port 8448');

});

