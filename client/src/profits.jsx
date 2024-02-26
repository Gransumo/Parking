import React, { useState, useEffect } from 'react';


const getProfits = async () => {
    return (
        // Iniciar el fetch
        await fetch('http://localhost:3001/profits', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                // Si la respuesta es negativa se lanza error
                if (!response.ok) {
                    throw new Error(`Fetch failed, error code: ${response.status}`);
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
                console.error('Error getting profits: ' + error.message);
            }));
}

const Profits = () => {
    const [profits, setProfits] = useState(null);

    useEffect(() => {
        try {
            // Se declara funcion asincrona para obtener las ganancias
            const fetchData = async () => {
                const newProfits = await getProfits();
                if (newProfits) {
                    setProfits(newProfits.montoTotal);
                }
            };

            // Se ejecuta función asincrona
            fetchData();
        } catch (error) {
            // Manejo de errores
            console.error('Error getting profits: ' + error.message);
        }
    });

    return(
        <>
            {profits}
        </>
    );
}

export default Profits;
