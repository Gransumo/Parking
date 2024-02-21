const conexionDB = require('./db');

const   existCar = async (plate) => {
    try {
        // Buscar si hay algun vehiculo con esa matricula dado de alta
        const vehiculoExistenteRes = await new Promise((resolve, reject) => {
            console.log(plate);
            conexionDB.query(
                'SELECT ID_Vehiculo FROM Vehiculo WHERE Matricula = ?',
                [plate],
                (err, res) => {
                    if (err) reject (err)
                    else resolve (res);
                }
            );
        });
        
        // Si existe algun coche con esa matricula dado de alta, retornar el ID_Vehiculo
        if (vehiculoExistenteRes.length > 0) {
            return vehiculoExistenteRes[0].ID_Vehiculo;
        }

        // Si no existe ningún coche con esa matricula dado de alta, retornar NULL
        return (null);
    } catch (error) {
        console.error('Error checking EXIST-CAR:', error.message);
        // Lanzar el error para manejarlo en el nivel superior si es necesario
        throw error;
    }
}

const   parkedCar = async (ID_Vehiculo) => {
    try {
        const insideCar = await new Promise((resolve, reject) => {
            conexionDB.query(
                'SELECT ID_Vehiculo FROM PlazaEstacionamiento WHERE ID_Vehiculo = ?',
                [ID_Vehiculo],
                (err, res) => {
                    if (err) reject (err);
                    else resolve (res);
                }
            );
        });

        // Si el vehículo ya está dentro del parking, imprimir un mensaje y retornar NULL
        if (insideCar.length > 0) {
            console.log(`The car with license plate ${plate} is already parked; the same car cannot occupy two parking spaces`);
            return (null);
        }
        return (1);
    } catch (error) {
        console.error('Error checking PARKED-CAR:', error.message);
        // Lanzar el error para manejarlo en el nivel superior si es necesario
        throw error;
    }
}

module.exports = { existCar, parkedCar };
