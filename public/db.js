// Configuración de la conexión a la base de datos
// (Mantengo este bloque ya que parece que lo necesitas para otras operaciones en tu aplicación)
const mysql2 = require('mysql2');

const connection = mysql2.createConnection({
    host: 'localhost',
    port: 3306, 
    user: 'root',
    password: '',
    database: 'parking2'
});

connection.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conexión exitosa a la base de datos');
});

module.exports = connection;