const dbManager = require('./dbManager');

function generarMatriculaAleatoria() {
    const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numeros = '0123456789';

    let matricula = '';
    for (let i = 0; i < 3; i++) {
        matricula += letras.charAt(Math.floor(Math.random() * letras.length));
    }
    matricula += '-';
    for (let i = 0; i < 4; i++) {
        matricula += numeros.charAt(Math.floor(Math.random() * numeros.length));
    }

    return matricula;
}

// Funcion que se ejecutará al dar click en el boton entrar coche
async function cocheEntra() {
    try {
        // Traer los datos de las plazas
        const plazasEstacionamiento = dbManager.getPlazas();
        
        // Filtrar para conseguir un array con las plazas libres
        const plazasLibres = plazasEstacionamiento.filter(plaza => plaza.Disponible === 1);

        // Si hay plazas libres se ejecuta
        if (plazasLibres.length > 0) {
            // Elegir una plaza aleatoria entre las plazas libres
            const plazaAleatoria = plazasLibres[Math.floor(Math.random() * plazasLibres.length)].id_plaza;

            // Crear una matricula aleatoria
            const matricula = generarMatriculaAleatoria();

            // Insertar la matricula en la bbdd
            await dbManager.insertCar(plazaAleatoria, matricula);

            // Actualizar la información del DataBase Manager
            await dbManager.updatePlazas();

            // Imprimir por consola la acción
            console.log('Coche entrando en la plaza:', plazaAleatoria, 'con matrícula:', matricula);

            return ({ id_plaza: plazaAleatoria, Matricula: matricula });
        } else {
            throw new Error('Lo sentimos, no hay plazas libres disponibles.');
        }
    } catch (error) {
        //console.error(error.message);
        throw error;
    }
}

async function cocheSale() {

    // Traer los datos de las plazas
    var plazasEstacionamiento = dbManager.getPlazas();

    // Filtrar para conseguir un array con las plazas ocupadas
    const plazasOcupadas = plazasEstacionamiento.filter(plaza => plaza.Disponible === 0);

    // Si hay plazas ocupadas se ejecuta
    if (plazasOcupadas.length > 0) {

        // Elegir una plaza aleatoria entre las plazas ocupadas
        const plazaAleatoria = plazasOcupadas[Math.floor(Math.random() * plazasOcupadas.length)].id_plaza;

        // Sacar el coche de la plaza en la bbdd
        await dbManager.exitCar(plazaAleatoria);

        // Actualizar la información del DataBase Manager
        await dbManager.updatePlazas();

        // Imprimir por consola la acción
        console.log('Coche saliendo de la plaza:', plazaAleatoria);

        return ({ id_plaza: plazaAleatoria });
    } else {
        console.log('El parking está vacío.');
    }
}


module.exports = { cocheEntra, cocheSale };