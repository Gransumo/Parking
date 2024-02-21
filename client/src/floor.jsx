//import React, { useState, useEffect } from 'react';
import Slot from "./slot";
import { Row } from 'react-bootstrap';


const Floor = (datosPlazas) => {
    /* const [datosPlazas, setDatosPlazas] = useState(null);

    useEffect(() => {
        const wsClient = new WebSocketClient('ws://localhost:3001', setDatosPlazas);

        return () => {
            wsClient.closeConnection();
        };
    }, []); */

    if (!datosPlazas) {
        return <div>Cargando... on Floor</div>;
    }

    if (!Array.isArray(datosPlazas)) {
        return <p>Data is not an Array on floor</p>;
    }
    const floor1 = datosPlazas.slice(0, 10);
    const floor2 = datosPlazas.slice(10, 20);
    return (
        <div>
            <div className='p-4 m-4 border border-black planta text-center'>
                <div><h1>PLANTA 1</h1></div>
                <div>
                    <Row xs={1} md={2} lg={3} xl={5} className="g-4">
                        {
                            floor1.map((plaza, id) => (
                                <Slot key={plaza.id} id={plaza.id} status={plaza.Disponible} />
                            ))
                        }
                    </Row>
                </div>
            </div>
            <div className='p-4 m-4 border border-black planta text-center'>
                <div><h1>PLANTA 2</h1></div>
                <div>
                    <Row xs={1} md={2} lg={3} xl={5} className="g-4">
                        {
                            floor2.map((plaza, id) => (
                                <Slot key={plaza.id} id={plaza.id} status={plaza.Disponible} />
                            ))
                        }
                    </Row>
                </div>
            </div>
        </div>
    );
};

export { Floor };
