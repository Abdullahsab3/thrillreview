import './styling/addThemePark.css'
import React, { useState } from 'react';
import { Card, Dropdown } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { backendServer } from '../helpers';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { setSyntheticTrailingComments } from 'typescript';
import axios from 'axios';
import { allowedNodeEnvironmentFlags } from 'process';
import { loggedIn } from '../localStorageProcessing'
import CardWithLinkTo from '../higherOrderComponents/HigherOrderComponents';

function AddThemePark() {
    const navigate = useNavigate()
    const [name, setName] = useState("")
    const [opening, setOpening] = useState("")
    const [street, setStreet] = useState("")
    const [streetNr, setStreetNr] = useState("")
    const [postalCode, setPostalCode] = useState("")
    const [country, setCountry] = useState("")
    const [indoor, setIndoor] = useState(false)
    const [outdoor, setOutdoor] = useState(false)
    const [themeParkurl, setUrl] = useState("")

  
    var user: Boolean = loggedIn();


    const [validated, setValidated] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        const form = event.currentTarget

        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            axios.post(backendServer("/themepark"), {
                name: name,
                openingsdate: opening,
                street: street,
                streetNumber: streetNr,
                postalCode: postalCode,
                country: country,
                type: "",
                website: themeParkurl,
            }).then((response) => {
                if (response.data.recognised) {
                    navigate("/home")
                }
            }).catch(function (error) {
                if (error.response.status === 418) {
                    alert("Adress not found")
                }
            })
        }
        event.preventDefault();
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
                        <Form.Control required type="text" onChange={(e) => setStreet(e.target.value)} placeholder="Street" value={street} />
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
                    <div id="country">
                        Country
                        <Form.Control required type="text" placeholder="Country" onChange={(e) => setCountry(e.target.value)} />
                        <Form.Control.Feedback type="invalid">
                            Country is required.
                        </Form.Control.Feedback>
                    </div>
                </div>
            </Form.Group>
        );
    }


    // length, height, duration : zal nog gevalideerd worden dat echt cijfer is  : https://codesandbox.io/s/9zjo1lp86w?file=/src/Components/InputDecimal.jsx
    // row moet rond card want anders krijg je een lelijke gap tussen header en de card
    if (user) {
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
                                    <Form.Group id="address">
                                        <Form.Label> Address </Form.Label>
                                        <div id="address-components">
                                            <div id="street">
                                                Street*
                                                <Form.Control required type="text" onChange={(e) => setStreet(e.target.value)} placeholder="Street" value={street} />
                                                <Form.Control.Feedback type="invalid">
                                                    Street is required
                                                </Form.Control.Feedback>
                                            </div>

                                            <div id="streetNr">
                                                Street Number*
                                                <Form.Control required type="text" placeholder="Street number" pattern="[0-9]*" onChange={(e) => setStreetNr(e.target.value)} />
                                                <Form.Control.Feedback type="invalid">
                                                    Street number is required and should be a number.
                                                </Form.Control.Feedback>
                                            </div>
                                            <div id="postalCode">
                                                Postal Code*
                                                <Form.Control required type="text" placeholder="Postal code" pattern="[0-9]*" onChange={(e) => setPostalCode(e.target.value)} />
                                                <Form.Control.Feedback type="invalid">
                                                    Postal code is required and should be a number.
                                                </Form.Control.Feedback>
                                            </div>
                                            <div id="country">
                                                Country*
                                                <Form.Control required type="text" placeholder="Country" onChange={(e) => setCountry(e.target.value)} />
                                                <Form.Control.Feedback type="invalid">
                                                    Country is required.
                                                </Form.Control.Feedback>
                                            </div>
                                        </div>
                                    </Form.Group>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label >Type</Form.Label>
                                            <InputGroup><Form.Check label="Indoor park" onChange={(e) => indoor ? setIndoor(false) : setIndoor(true)} /> </InputGroup>
                                            <InputGroup><Form.Check label="Outdoor park" onChange={(e) => outdoor ? setOutdoor(true) : setOutdoor(false)} /> </InputGroup>
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label> Link to themeparks website </Form.Label>
                                            <Form.Control type="url" onChange={(e) => setUrl(e.target.value)} />
                                            <Form.Control.Feedback type="invalid">
                                                A valid url should be given, starting with https:// or http://.
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Button type="submit" >Submit</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Row >
            </div >);
    } else {
        return (
            <CardWithLinkTo to='/Login' title='Please log in first.' />
        );
    }

}
export default AddThemePark;