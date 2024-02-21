import React, { useState, useEffect } from 'react';
import moment from 'moment';

const Time = ({ dateTime }) => {
    // Variable de estado del componente
    const [tiempoTranscurrido, setTiempoTranscurrido] = useState(null);

    // Efecto que se ejecutará cada vez que cambie el datetime
    useEffect(() => {
        if (dateTime) {
            // Si existe un dateTime se declara un intervalo de 1 segundo
            const interval = setInterval(() => {
                // Se calcula la diferencia de tiempo entre dateTime y el momento actual para saber el tiempo transcurrido
                setTiempoTranscurrido(moment().diff(moment(dateTime)));
            }, 1000);

            // Se retorna funcion de limpueza, en este caso una funcion que limpia el intervalo
            return () => clearInterval(interval);
        }
    }, [dateTime]);

    if (dateTime === null) {
        return null;
    }

    const duracion = moment.duration(tiempoTranscurrido);
    const horas = Math.floor(duracion.asHours());
    const minutos = Math.floor(duracion.asMinutes());
    const segundos = duracion.seconds();
    const total = ((horas > 0) ? horas : '') + `0${minutos}:$`;
    const segundosFormateados = segundos < 10 ? `0${segundos}` : segundos;

    return (
        <span>
            {minutos}:{segundosFormateados}
        </span>
    );
};

export default Time;
