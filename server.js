const server = require('express')();
const http = require('http').createServer(server);
const io = require('socket.io')(http, {
    cors: {
      origin: "http://localhost:8080",
      methods: ["GET", "POST"]
    }
  });
const XMLHttpRequest = require('xhr2');

let players = [];

const sendHttpRequest = (method, url, data) => {
    const promise = new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(method, url);
  
      xhr.responseType = "json";
  
      if (data) {
        xhr.setRequestHeader("Content-Type", "application/json");
      }
  
      xhr.onload = () => {
        if (xhr.status >= 400) {
          reject(xhr.response);
        } else {
          resolve(xhr.response);
        }
      };
  
      xhr.onerror = () => reject("Something went wrong!");
  
      xhr.send(JSON.stringify(data));
    });
    return promise;
};

io.on('connection', function (socket) {
    console.log('A user connected: ' + socket.id);

    players.push(socket.id);

    if (players.length === 1) {
        io.emit('isPlayerA');
    };

    socket.on('dealCards', function () {
        sendHttpRequest("GET", "http://localhost:8000/deck-card").then((responseData) => {
            io.emit('dealCards', responseData);
        });
    });

    socket.on('cardPlayed', function (gameObject, isPlayerA, lastAttack) {
        io.emit('cardPlayed', gameObject, isPlayerA, lastAttack);
    });

    socket.on('disconnect', function () {
        console.log('A user disconnected: ' + socket.id);
        players = players.filter(player => player !== socket.id);
    });
});

http.listen(3000, function () {
    console.log('Server started!');
});