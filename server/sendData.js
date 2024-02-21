const WebSocket = require('ws');

let wss;

function setWebSocketServer(webSocketServer) {
    wss = webSocketServer;
}

function sendData(data) {
    if (wss) {
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                //console.log("enviado");
                client.send(JSON.stringify(data));
            }
        })
    }
}

module.exports = { setWebSocketServer, sendData};
