const { response } = require('express');
const db = require('./db');
var plazas = null;

const insertCar = async (ID_Plaza, matricula) => {
    try {
        console.log(ID_Plaza + ' ' + matricula);
        await new Promise((resolve, reject) => {
            db.query(
                "UPDATE Plazas SET Matricula = ? WHERE id_plaza = ?",
                [matricula, ID_Plaza],
                (err, res) => {
                    if (err) reject(err)
                    else resolve(res);
                }
            );
        });
    } catch (error) {
        console.error('Error en insertCar: ' + error.message);
        throw new Error('Error al intriducir el coche');
    }
}

const updatePlazas = async () => {
    try {
        const respuesta = await new Promise((resolve, reject) => {
            db.query(
                "SELECT * FROM Plazas",
                [],
                (err, res) => {
                    if (err) reject(err)
                    else resolve(res);
                }
            )
        });
        plazas = respuesta;
    } catch (error) {
        console.error('Error actualizando los datos de las plazas');
        throw new Error('Error actualizando los datos de las plazas');
    }
}

function getPlazas () {
    if (plazas)
        return plazas;
}

const exitCar = async (ID_Plaza) => {
    try {
        await new Promise((resolve, reject) => {
            db.query(
                "UPDATE Plazas SET Matricula = null WHERE id_plaza = ?",
                [ID_Plaza],
                (err, res) => {
                    if (err) reject(err)
                    else resolve(res);
                }
            );
        });
    } catch (error) {
        console.error('ERROR EXIT CAR, ERROR CODE: ' + error.message);
    }
}

const getMoney = async () => {
    try {
        const respuesta = await new Promise((resolve, reject) => {
            db.query(
                `SELECT SUM(Importe) AS SumaImportes
                FROM Tickets
                WHERE DATE(Inicio)=CURDATE();`,
                [],
                (err, res) => {
                    if (err) reject(err)
                    else resolve(res);
                }
            )
        });
        return respuesta[0].SumaImportes;
    } catch (error) {
    }
}

module.exports = { getPlazas, updatePlazas, insertCar, exitCar, getMoney }