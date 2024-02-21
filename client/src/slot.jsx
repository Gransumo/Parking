import { Card, Col } from 'react-bootstrap';
const slot = ({id, status}) => {
    return (
        <Col>
            <Card id={id} className={`card ${(status) ? 'free' : 'taken'}`}>
                <Card.Body className="text-center">
                <i className="fa-solid fa-car fa-2x"></i>
                </Card.Body>
            </Card>
        </Col>
    );
};

export default slot;