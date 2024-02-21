const express = require('express');
const app = express();
const path = require('path');
const dbManager = require('./public/dbManager');
const main = require('./public/main');


// Configurar Express para servir archivos estáticos desde la carpeta "views"
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Ruta para la página principal
app.get('/', async (req, res) => {
    // Actualizar los datos del parking
    await dbManager.updatePlazas();

    // Traer los datos del parking para enviarselos a la vista
    const plazas = dbManager.getPlazas();

    // Si existen datos en plazas renderizar la vista
    if (plazas)
        res.render('index.ejs', { titulo: 'Parking', plazas: plazas });
});


// Ruta para meter un coche
app.get('/meterCoche', async (req, res) => {
    try {
        // Meto el coche en la bbdd
        const plaza = await main.cocheEntra();
        // En caso afirmativo devuelve el id de la plaza y la matricula ingresada con el codigo de peticion 200
        res.status(200).json({ id_plaza: plaza.id_plaza, Matricula: plaza.Matricula });
    } catch (error) {
        // En caso contrario de devuelve el mensaje que tenga el error con el codigo 500
        res.status(500).json({ message: error.message });
    }    
});

app.get('/sacarCoche', async (req, res) => {
    try {
        const plaza = await main.cocheSale();
        res.status(200).json({ id_plaza: plaza.id_plaza });
    } catch (error) {
        res.status(500).json({ message: error.message });
    } 
});

app.get('/obtenerGanancias', async (req, res) => {
    
});

const PORT =  3000;
app.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto ${PORT}`);
});