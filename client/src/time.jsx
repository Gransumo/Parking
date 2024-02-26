import React, { useEffect, useState } from 'react';
import moment from 'moment';

const calculateTimePassed = (dateTime) => {
    const currentTime = moment();
    const diff = moment.duration(currentTime.diff(moment(dateTime)));
    return `
        ${(diff.hours() < 10) ? '0'+ diff.hours() : diff.hours()}:
        ${(diff.minutes() < 10) ? '0'+ diff.minutes() : diff.minutes()}:
        ${(diff.seconds() < 10) ? '0'+ diff.seconds() : diff.seconds()}`;
};

const TimePassedCounter = ({ dateTime }) => {
    const [timePassed, setTimePassed] = useState(calculateTimePassed(dateTime));

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTimePassed(calculateTimePassed(dateTime));
        }, 1000);
        
        // Limpia el intervalo al desmontar el componente
        return () => clearInterval(intervalId);
    });
    
    if (!dateTime) {
        return (<></>);
    }
    return (
        <>
            {timePassed}
        </>
    );
};

export default TimePassedCounter;

