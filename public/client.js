function setOccuped(id) {
    // Traer la plaza del DOM
    const spotDiv = document.getElementById(id);

    // Determinar si contiene la clase libre, si la contiene se quita
    if (spotDiv.classList.contains('libre')) {
        spotDiv.classList.remove('libre');
    }

    // Establecer la clase ocupado
    spotDiv.classList.add('ocupado');
}

// Funcion para poner una plaza como libre
function setFree(id) {
    // Traer la plaza del DOM
    const spotDiv = document.getElementById(id);

    // Determinar si contiene la clase ocupado, si la contiene se quita
    if (spotDiv.classList.contains('ocupado')) {
        spotDiv.classList.remove('ocupado');
    }

    // Establecer la clase libre
    spotDiv.classList.add('libre');
}

async function insertCar() {
    return (
        // Iniciar el fetch
        await fetch('http://localhost:3000/meterCoche', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                // Si la respuesta es negativa se lanza error
                if (!response.ok)
                    throw new Error(response.status);

                //Se retorna el response en formato json al siguiente then
                return response.json();
            })
            .then((data) => {
                // El fetch retorna la data
                return (data);
            })
            .catch((error) => {
                // Se manejan errores durante el fetch
                console.error('Fetch falló en insertCar, error code: ' + error.code);
            }));
}

async function exitCar() {
    return (
        // Iniciar el fetch
        await fetch('http://localhost:3000/sacarCoche', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                // Si la respuesta es negativa se lanza error
                if (!response.ok) {
                    throw new Error(response.status);
                }

                //Se retorna el response en formato json al siguiente then
                return response.json();
            })
            .then((data) => {
                // El fetch retorna la data
                return (data);
            })
            .catch((error) => {
                // Se manejan errores durante el fetch
                console.error('Fetch falló en exitCar, error code: ' + error.message);
            }));
}

async function cocheEntra() {
    try {
        // Decir al backend que introduzca un coche
        const response = await insertCar();
        console.log(response);
        if (response.id_plaza) {
            // Representar la plaza como ocupada
            setOccuped(response.id_plaza);
            alert('Ha entrado un coche de matricula ' + response.Matricula + ' en la plaza ' + response.id_plaza);
        }
        else
            console.log(response.status);
    } catch (error) {
        console.error(error.message);
    }
}

async function cocheSale() {

    try {
        // Decir al backend que saque un coche
        const response = await exitCar();

        //Si devuelve una id plaza la pone libre sino imprime por consola el mensaje
        if (response.id_plaza) {
            setFree(response.id_plaza);
            alert('Ha salido un coche de la plaza ' + response.id_plaza);
        }
        else
            console.log(response.message);
    } catch (error) {
        // Se manejan errores
        console.error(error.message);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('entrar_boton').addEventListener('click', () => {
        cocheEntra();
    });
    document.getElementById('salir_boton').addEventListener('click', () => {
        cocheSale();
    });
});
