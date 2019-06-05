const express = require('express');
const uuidv4 = require('uuid/v4');
const SocketServer = require('ws').Server;

// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ server });

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
wss.on('connection', (ws) => {
  console.log('Client connected');

//send message to all client
wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    client.send(JSON.stringify(data));
  });
};

ws.on('message',function(message){
    console.log("***MESSAGE");
    const newMessage =JSON.parse(message);
    newMessage.id = uuidv4();
    console.log(newMessage.username, 'said', newMessage.content);
    newMessage.type = newMessage.type === 'postNotification' ? 'incomingNotification' : 'incomingMessage';
    wss.broadcast(newMessage);
  }
);

// Set up a callback for when a client closes the socket. This usually means they closed their browser.
ws.on('close', () => console.log('Client disconnected'));
});
