import { w3cwebsocket as W3CWebSocket } from 'websocket';

class WebSocketClient {
    constructor(url, onMessage) {
        this.ws = new W3CWebSocket(url);
        this.url = url;
        this.data = null;
        this.ws.onopen = () => {
            console.log('Conexión establecida');
        };

        this.ws.onmessage = (event) => {
            if (event.data instanceof ArrayBuffer) {
                console.log('Mensaje binario recibido:', event.data);
            } else {
                try {
                    this.data = event.data;
                    onMessage(JSON.parse(this.data));
                } catch (error) {
                    console.error('Error al parsear el JSON:', error.message);
                }
            }
        };

        this.ws.onclose = () => {
            console.log('Conexión cerrada');
        };
    }

    closeConnection() {
        this.ws.close();
    }
}

export default WebSocketClient;