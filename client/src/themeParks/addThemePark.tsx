import '../attractions/styling/addThemePark.css'
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
import { setSyntheticTrailingComments } from 'typescript';

function AddThemePark() {
    const navigate = useNavigate()

    const [name, setName] = useState("")
    const [opening, setOpening] = useState("")
    const [street, setStreet] = useState("")
    const [streetNr, setStreetNr] = useState("")
    const [postalCode, setPostalCode] = useState("")


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

    // I use div and custom css because row/col did not do what I wanted
    function AddressFormGroup() {
        return (
            <Form.Group id="address">
                <Form.Label> Address </Form.Label>
                <div id="address-components">
                    <div id="street">
                        Street
                        <Form.Control required type="text" onChange={(e) => setStreet(e.target.value)} placeholder="Street" />
                        <Form.Control.Feedback type="invalid">
                            Street is required
                        </Form.Control.Feedback>
                    </div>

                    <div id="streetNr">
                        Street Number
                        <Form.Control required type="text" placeholder="Street number" pattern="[0-9]*" onChange={(e) => setStreetNr(e.target.value)} />
                        <Form.Control.Feedback type="invalid">
                            Street number is required and should be a number.
                        </Form.Control.Feedback>
                    </div>

                    <div id="postalCode">
                        Postal Code
                        <Form.Control required type="text" placeholder="Postal code" pattern="[0-9]*" onChange={(e) => setPostalCode(e.target.value)} />
                        <Form.Control.Feedback type="invalid">
                            Postal code is required and should be a number.
                        </Form.Control.Feedback>
                    </div>
                </div>
            </Form.Group>
        );
    }


    // length, height, duration : zal nog gevalideerd worden dat echt cijfer is  : https://codesandbox.io/s/9zjo1lp86w?file=/src/Components/InputDecimal.jsx
    // row moet rond card want anders krijg je een lelijke gap tussen header en de card
    return (
        <div className="ContentOfPage">
            <h1>Add a theme park</h1>
            <Row>
                <Card>
                    <Card.Body>
                        <Card.Title>Add a new theme park</Card.Title>
                        <Card.Text>Fill in the form to add a new theme park. Please check first if the theme park is not a duplicate.</Card.Text>
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
                                <Col>
                                    <Form.Group>
                                        <Form.Label>Opening</Form.Label>
                                        <Form.Control type="date" onChange={(e) => setOpening(e.target.value)} />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <AddressFormGroup />
                            </Row>
                            <Button type="submit">Submit</Button>
                        </Form>
                    </Card.Body>
                </Card>
            </Row >
        </div >);
}

export default AddThemePark;