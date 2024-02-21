import './App.css';
import React, { useState, useEffect } from 'react';
import Slot from "./slot";
import { Col, Row, Table } from 'react-bootstrap';
import WebSocketClient from './WebSocketManager'
import Modal from './Modal';
import Time from './time';


// Funcion que hace un fetch para obtener las ganancias del dia
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

// Funcion que enciende y apaga el parking
const switchParkingState = async (state) => {
    await fetch(`http://localhost:3001/${state}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((response) => {
            // Si la respuesta es negativa lanza error
            if (!response.ok) {
                throw new Error(`Parking-State Change function failed with err code: ${response.status}`);
            }
        })
        .catch((error) => {
            // Se manejan errores durante el fetch
            console.error('Error getting profits: ' + error.message);
        })
}

const App = () => {
    // Declaro estados
    const [datosPlazas, setDatosPlazas] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [profits, setProfits] = useState(null);

    // Función interruptor de parking
    const changeState = () => {
        var state;
        var checkbox = document.getElementById('parkingStateChanger');
        if (checkbox.checked)
            state = 'start';
        else
            state = 'stop';
        switchParkingState(state);
    }

    // Obtener las ganancias del dia cada vez que cambian los datos de las plazas
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
    }, [datosPlazas]);

    // Se declara una conexion una sola vez al cargar el componente
    useEffect(() => {
        try {
            // Se crea objeto WebSocketClient pasandole la direccion del servidor y la funcion a ejecutar cuando reciba un mensaje
            const wsClient = new WebSocketClient('ws://localhost:3001', setDatosPlazas);
            // Se retorna una funcion de limpieza que se ejecutará cuando el componente se desmonte
            return () => {
                wsClient.closeConnection();
            };
        } catch (error) {
            console.error("Error creating wsClient");
        }
    }, []);

    // Funcion que se encarga de abrir el modal
    const handleOpenModal = () => {
        setModalOpen(true);
    };

    // Funcion que se encarga de cerrar el modal
    const handleCloseModal = () => {
        setModalOpen(false);
    };

    // Si datosPlazas no tiene nada pondrá pantalla de carga (Cuando el servidor no esté levantado)
    if (!datosPlazas) {
        return <div>Cargando...</div>;
    }

    // Si lo retornado por el servidor (datosPlazas) no es un array se muestra la advertencia por pantalla
    if (!Array.isArray(datosPlazas)) {
        return <p>Data is not an Array on app</p>;
    }

    // Separar los datos en las plantas correspondientes
    const floor1 = datosPlazas.slice(0, 10);
    const floor2 = datosPlazas.slice(10, 20);

    // Función encargada de variar entre planta 1 y planta 2 para mostrar
    const handleFloorSelect = (floor) => {
        // Se llaman los elementos del DOM
        let floor1_div = document.getElementById('floor1_div');
        let floor2_div = document.getElementById('floor2_div');

        // Si se quiere mostrar la planta 1
        if (floor === 'floor1') {
            // Se da al interruptor de d-none en la planta 1 para mostrarlo
            floor1_div.classList.toggle('d-none');

            // Si la planta 2 no contiene d-none, es decir, se está mostrando, se da al interruptor para ocultarla
            if (!floor2_div.classList.contains('d-none')) {
                floor2_div.classList.toggle('d-none');
            }
        }
        // Si se quiere mostrar la planta 2
        else {
            // Se da al interruptor de d-none en la planta 2 para mostrarlo
            floor2_div.classList.toggle('d-none');
            
            // Si la planta 1 no contiene d-none, es decir, se está mostrando, se da al interruptor para ocultarla
            if (!floor1_div.classList.contains('d-none')) {
                floor1_div.classList.toggle('d-none');
            }
        }
    };
    return (
        <div className='container-fluid vh-100 d-flex justify-content-center align-items-center'>
            <div className='container p-4'>
                {/* ON / OFF */}
                <div className="form-check form-switch d-flex justify-content-center">
                    <input className="form-check-input select-status" type="checkbox" role="switch" id="parkingStateChanger" onChange={changeState} />
                </div>

                {/* SELECT FLOOR */}
                <div className="text-center">
                    <input type="radio" name="floor" id="floor1" className='d-none' onChange={() => { handleFloorSelect('floor1') }} />
                    <label htmlFor="floor1" className='btn btn-outline-dark mx-2 mt-3'>PLANTA 1</label>
                    <input type="radio" name="floor" id="floor2" className='d-none' onChange={() => { handleFloorSelect('floor2') }} />
                    <label htmlFor="floor2" className='btn btn-outline-dark mx-2 mt-3'>PLANTA 2</label>
                </div>

                {/* FLOOR 1 */}
                <div className='p-4 m-4 border border-black planta text-center d-none' id='floor1_div'>
                    <div><h1>PLANTA 1</h1></div>
                    <Row xs={1} md={2} lg={3} xl={5} className="g-4">
                        {
                            // Se itera sobre los datos de la planta 1 para representar las plazas
                            floor1.map((plaza, id) => (
                                <Slot key={plaza.id} id={plaza.id} status={plaza.Disponible} />
                            ))
                        }
                    </Row>
                </div>

                {/* FLOOR 2 */}
                <div className='p-4 m-4 border border-black planta text-center d-none' id='floor2_div'>
                    <div><h1>PLANTA 2</h1></div>
                    <Row xs={1} md={2} lg={3} xl={5} className="g-4">
                        {
                            // Se itera sobre los datos de la planta 2 para representar las plazas
                            floor2.map((plaza, id) => (
                                <Slot key={plaza.id} id={plaza.id} status={plaza.Disponible} />
                            ))
                        }
                    </Row>
                </div>

                {/* MODAL 
                    isOpen -> booleano que determina si el modal está abierto o no
                    onClose -> funcion que se encargará de cerrar el modal
                    modalTitle -> titulo del modal
                */}
                <Modal isOpen={modalOpen} onClose={handleCloseModal} modalTitle={'INFORMACION DETALLADA'}>
                    <Row>
                        <Col>
                            <div className="text-center">
                                <h4>Primera Planta</h4>
                            </div>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Plaza</th>
                                        <th>Matricula</th>
                                        {<th>Tiempo Transcurrido</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {floor1.map((spot) => (
                                        <tr key={spot.Id_Plaza}>
                                            <td>{spot.Id_Plaza}</td>
                                            <td>{(spot.Matricula) ? spot.Matricula : "Libre"}</td>
                                            <td><Time datetime={spot.FechaHoraInicio} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Col>
                        <Col>
                            <div className="text-center">
                                <h4>Segunda Planta</h4>
                            </div>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Plaza</th>
                                        <th>Matricula</th>
                                        {<th>Tiempo Transcurrido</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {floor2.map((spot) => (
                                        <tr key={spot.Id_Plaza}>
                                            <td>{spot.Id_Plaza}</td>
                                            <td>{(spot.Matricula) ? spot.Matricula : "Libre"}</td>
                                            <td><Time datetime={spot.FechaHoraInicio} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                    <Table striped bordered hover>
                        <tbody>
                            <td className='text-center'>Ganancias del Dia: {profits}€ </td>
                        </tbody>
                    </Table>
                </Modal>
                <div className="buttoms p-4">
                    {/* Boton que abre el modal */}
                    <button onClick={handleOpenModal} className='btn btn-primary'>Ver Informacion Detallada</button>
                </div>
            </div>
        </div>
    );
};

export default App;

