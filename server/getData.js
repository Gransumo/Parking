const conexionDB = require('./db');
var DATA = null;

const updateData = async () => {
    try {
        const res = await new Promise((resolve, reject) => {
            conexionDB.query(
                `SELECT PlazaEstacionamiento.Id_Plaza, PlazaEstacionamiento.Disponible, Vehiculo.Matricula, TransaccionEstacionamiento.FechaHoraInicio
                FROM PlazaEstacionamiento
                LEFT JOIN Vehiculo ON PlazaEstacionamiento.ID_Vehiculo = Vehiculo.ID_Vehiculo
                LEFT JOIN TransaccionEstacionamiento ON PlazaEstacionamiento.ID_Plaza = TransaccionEstacionamiento.ID_Plaza
                AND TransaccionEstacionamiento.FechaHoraFin IS NULL;`,
                (err, res) => {
                    if (err) reject(err);
                    resolve(res);
                }
            );
        });

        DATA = res;
        return 1;
    } catch (error) {
        console.error("Error Updating DATA:", error);
    }
};

const getProfits = async () => {
    try {
        const res = await new Promise((resolve, reject) => {
            conexionDB.query(
                `SELECT SUM(MontoPagado) AS SumaMontosPagados
                FROM TransaccionEstacionamiento
                WHERE DATE(FechaHoraInicio) = CURDATE()`,
                (err, res) => {
                    if (err) reject(err)
                    else resolve(res);
                });
        });
        return (res);
    } catch (error) {
        console.error("Error getting Profits:", error);
    }
}

function getData() {
    return DATA;
}

module.exports = { getData, updateData, getProfits };
