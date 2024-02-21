const conexionDB = require('./db');
const checker = require('./checker');

const insertCar = async (plate) => {
    try {
        // Comprobar si el vehiculo ya esta dado de alta
        const exist_car = await checker.existCar(plate);
        if (exist_car != null) {
            return (exist_car);
        }

        // Insertar un nuevo vehículo si la matrícula no está dada de alta
        const insertarVehiculo = await new Promise((resolve, reject) => {
            conexionDB.query(
                'INSERT INTO Vehiculo (Matricula) VALUES (?)',
                [plate],
                (err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                }
            );
        });

        // Obtener el ID del vehículo recién insertado
        const idVehiculo = insertarVehiculo.insertId;

        // Se retorna el id del vehiculo dado de alta
        return idVehiculo;
    } catch (error) {
        console.error('Error inserting vehicle: ', error.message);
        // Lanzar el error para manejarlo en el nivel superior si es necesario
        throw error;
    }
};

const parkCar = async (ID_Plaza, plate) => {
    try {
        // Obtener el ID del Vehiculo
        const ID_Vehiculo = await insertCar(plate);

        // Verificar si el vehículo ya está estacionado en otra plaza
        const parkedCheck = await checker.parkedCar(ID_Vehiculo);
        if (parkedCheck === null)
            return (null);

        // Actualizar el registro de la plaza con el ID del vehículo y cambiar el estado de disponibilidad a FALSE
        const actualizarPlaza = await new Promise((resolve, reject) => {
            conexionDB.query(
                'UPDATE PlazaEstacionamiento SET ID_Vehiculo = ? WHERE ID_Plaza = ?',
                [ID_Vehiculo, ID_Plaza],
                (err, res) => {
                    if (err) reject(err);
                    else resolve(res);
                }
            );
        });

        // Verificar si se actualizó correctamente
        if (actualizarPlaza.affectedRows == 1) {
            console.log(`Car with license plate ${plate} parked successfully in Plaza ${ID_Plaza}`);
        } else {
            console.log(`Failed to park car with license plate ${plate} in Plaza ${ID_Plaza}`);
        }

        /* // Crear el ticket / Registro en TransaccionEstacionamiento
        await openTicket(ID_Plaza, ID_Vehiculo); */
    } catch (error) {
        console.error('Error parking vehicle :', error.message);
        // Lanzar el error para manejarlo en el nivel superior si es necesario
        throw error;
    }
}

const leaveCar = async (ID_Plaza) => {
    try {
        // Obtengo la matricula para luego escribirla en el mensaje
        const plate = await new Promise((resolve, reject) => {
            conexionDB.query(
                "SELECT Vehiculo.Matricula FROM PlazaEstacionamiento " +
                "INNER JOIN Vehiculo ON PlazaEstacionamiento.ID_Vehiculo = Vehiculo.ID_Vehiculo " +
                "WHERE PlazaEstacionamiento.ID_Plaza = ?",
                [ID_Plaza],
                (err, res) => {
                    console.log("ID_PLAZA: " + ID_Plaza + " Matricula: " + res[0].Matricula);
                    if (err) reject(err);
                    else if (res.length === 0) {
                        throw new Error("There is not car with selected plate in the parking")
                    };
                    resolve(res[0].Matricula);
                }
            );
        });

        // Actualizar el registro de la plaza, cambiar disponibilidad a TRUE y poner ID_Vehiculo en NULL
        const updateSpot = await new Promise((resolve, reject) => {
            conexionDB.query(
                "UPDATE PlazaEstacionamiento SET ID_Vehiculo = null WHERE ID_Plaza = ?",
                [ID_Plaza],
                (err, res) => {
                    if (err) reject(err);
                    else resolve(res);
                }
            );
        });

        // Verificar si se actualizó correctamente
        if (updateSpot.affectedRows == 1) {
            console.log(`Car with license plate ${plate} leave parking successfully from Plaza ${ID_Plaza}`);
        } else {
            console.log(`Car with license plate ${plate} failed to leave parking from Plaza ${ID_Plaza}`);
        }
        //await closeTicket(ID_Plaza);
    } catch (error) {
        console.error('Error leaving the parking: ', error.message);
        // Lanzar el error para manejarlo en el nivel superior si es necesario
        throw error;
    }
}

module.exports = { parkCar, leaveCar };
