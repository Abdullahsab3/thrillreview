import '../attractions/styling/addAttraction.css'
import React, { useState } from 'react';
import { Card, Dropdown } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { backendServer } from '../helpers';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

function AddThemePark() {
    const navigate = useNavigate()

    const [name, setName] = useState("")
    const [opening, setOpening] = useState("")
    

    const [validated, setValidated] = useState(false);

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        const form = event.currentTarget
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
           alert("WHOOOHHHHWWWWOOOOW");
        }
        setValidated(true);
    }


    // length, height, duration : zal nog gevalideerd worden dat echt cijfer is  : https://codesandbox.io/s/9zjo1lp86w?file=/src/Components/InputDecimal.jsx
    // row moet rond card want anders krijg je een lelijke gap tussen header en de card
    return (
        <div className="ContentOfPage">
            <h1>Add a theme park</h1>
            <Row>
                <Card>
                    <Card.Body>
                        <Card.Title>Add a new attraction</Card.Title>
                        <Card.Text>Fill in the form to add a new attraction. Please check first if the attraction is not a duplicate.</Card.Text>
                        <Form className="align-items-center" noValidate validated={validated} onSubmit={handleSubmit}>
                            <Row lg={2} sm={1}>
                                <Col>
                                    <Form.Group>
                                        <Form.Label> Name* </Form.Label>
                                        <Form.Control required type="text" onChange={(e) => setName(e.target.value)} />
                                        <Form.Control.Feedback type="invalid">
                                            Name is required
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row lg={2} sm={1}>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>Opening</Form.Label>
                                        <Form.Control type="date" onChange={(e) => setOpening(e.target.value)} />
                                    </Form.Group>
                                </Col>
            
                            </Row>                          
 

                            <Button type="submit">Submit</Button>
                        </Form>
                    </Card.Body>
                </Card>
            </Row >
        </div >);
}

export default AddThemePark;