const   express = require('express');
const   http = require('http');
const   WebSocket = require('ws');
const   DATA = require('./getData');
const   send = require('./sendData');
const   parkingControl = require('./random');

const   app = express();
const   server = http.createServer(app);
const   wss = new WebSocket.Server({ server });
var     isStarted = false;

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });

send.setWebSocketServer(wss);
var start;

const init = async () => {
    start = await new Promise((resolve) => {
        resolve(DATA.updateData());
    });
}

init();
var nClients = 0;

app.get('/profits', async (req, res) => {
    try {
        const profits = await DATA.getProfits();
        res.status(200).json( { montoTotal: profits[0].SumaMontosPagados } );
    } catch (error) {
        console.error('Error obteniendo profits:', error.message);
        res.status(500).json({ error: 'Error obteniendo profits' });
    }
});

app.get('/start', (req, res) => {
    if (!isStarted) {
        isStarted = parkingControl.initParking();
        res.send('Iniciando el control de estacionamiento...');
    } else {
        res.send('El control de estacionamiento ya está iniciado.');
    }
});

app.get('/stop', (req, res) => {
    if (isStarted) {
        isStarted = parkingControl.stopParking();
        res.send('Deteniendo el control de estacionamiento...');
    } else {
        res.send('El control de estacionamiento ya está detenido.');
    }
});


wss.on('connection', async (ws) => {
    nClients++;
    console.log('Cliente conectado');
    console.log(nClients + " clientes conectados");
    var x = await DATA.updateData();
    if (x === 1)
        send.sendData(DATA.getData());
    ws.on('message', (message) => {
        if (message === 'init' && start === 1) {
            parkingControl.initParking();
        }
        else if( message === 'stop') {
            parkingControl.stopParking();
        }
    });
    ws.on('close', () => {
        nClients--;
      console.log('Cliente desconectado');
    });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
