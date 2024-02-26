const DATA = require('./getData');
const parkingUtils = require('./inserts');
const send = require('./sendData');
var intervalEntry = null;
var intervalExit = null;
const conf = require('./config');


const generateRandomLicensePlate = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';

    // Generar 3 letras aleatorias
    const letter1 = letters[Math.floor(Math.random() * letters.length)];
    const letter2 = letters[Math.floor(Math.random() * letters.length)];
    const letter3 = letters[Math.floor(Math.random() * letters.length)];

    // Generar 4 numeros aleatorios
    const number1 = numbers[Math.floor(Math.random() * numbers.length)];
    const number2 = numbers[Math.floor(Math.random() * numbers.length)];
    const number3 = numbers[Math.floor(Math.random() * numbers.length)];
    const number4 = numbers[Math.floor(Math.random() * numbers.length)];

    // Construir la placa concatenando
    const licensePlate = `${letter1}${letter2}${letter3} ${number1}${number2}${number3}${number4}`;

    return licensePlate;
};

function getExitInterval() {
    const minTiempo = conf.min_interval_exit * 1000;
    const maxTiempo = conf.max_interval_exit * 1000;
    return Math.floor(Math.random() * (maxTiempo - minTiempo + 1)) + minTiempo;
}

function getEntryInterval() {
    const minTiempo = conf.min_interval_entry * 1000;
    const maxTiempo = conf.max_interval_entry * 1000;
    return Math.floor(Math.random() * (maxTiempo - minTiempo + 1)) + minTiempo;
}

const fillParking = async () => {
    const possibleSpots = DATA.getData().filter(spot => spot.Disponible === 1);
    if (possibleSpots.length != 0) {
        const ID_Plaza = possibleSpots[Math.floor(Math.random() * possibleSpots.length)].Id_Plaza;
        await parkingUtils.parkCar(ID_Plaza, generateRandomLicensePlate());
        await DATA.updateData();
        send.sendData(DATA.getData());
    }
    if (possibleSpots.length === 0) {
        console.log("TODO ESTÁ OCUPADO");
    }
    clearInterval(intervalEntry);
    intervalEntry = setInterval(fillParking, getEntryInterval());
}

const emptyParking = async () => {
    const possibleSpots = DATA.getData().filter(spot => spot.Disponible === 0);
    if (possibleSpots.length != 0) {
        const ID_Plaza = possibleSpots[Math.floor(Math.random() * possibleSpots.length)].Id_Plaza;
        await parkingUtils.leaveCar(ID_Plaza);
        await DATA.updateData();
        send.sendData(DATA.getData());
    }
    else {
        console.log("TODO ESTA VACIO");
    }
    clearInterval(intervalExit);
    intervalExit = setInterval(emptyParking, getExitInterval());
}

function initParking() {
    intervalEntry = setInterval(fillParking, getEntryInterval());
    intervalExit = setInterval(emptyParking, getExitInterval());
    console.log("Starting Parking...");
    return (true);
};

function stopParking() {
    clearInterval(intervalEntry);
    clearInterval(intervalExit);
    console.log("Parking stoped correctly.");
    return (false);
}

module.exports = { initParking, stopParking };
