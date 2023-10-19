const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');

const client = new Client({
  authStrategy: new LocalAuth()
})

const app = express();
const port = 3000;
let data;

app.use(express.json());

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
    app.listen(port, () => {
      console.log(`API service is running on port ${port}`);
    });
});

const startServer = () =>{
  console.log(`Please Wait.. Initializing whatsapp client`);
  client.initialize()
}

app.post('/syslog', (req, res) => {
  // Handle incoming POST data here
  data = req.body;
  console.log('Received data:', data);
  sendMessage(data['id'],data['status'])
  // Send a response back to the client
  res.json({ message: 'Data received successfully' });
});

app.get('/getList', (req,res)=>{
  data = req.body;
  req.params
  client.getChats().then((chats)=>{
      const listChat = chats.map((chat) => {
          return {
            id: chat.id,    
            name: chat.name 
          };
      });

  console.log('listChat:', listChat);
  res.json({ listChat: listChat });
  });
});

startServer()

// Function to send a message to a chat
function sendMessage(GroupId,text) {
  const id = GroupId + "@g.us";
  client.sendMessage(id, text);
}