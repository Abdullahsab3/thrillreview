import './addAttraction.css'
import React, { useState } from 'react';
import { Card, Dropdown } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { backendServer } from './helpers';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Grid } from 'react-bootstrap-icons';

function AddAttraction() {
    const navigate = useNavigate()

    const [name, setName] = useState("")
    const [themepark, setThemepark] = useState("")
    const [opening, setOpening] = useState("")
    const [builder, setBuilder] = useState("")
    const [type, setType] = useState("")
    const [length, setLength] = useState("")
    const [height, setHeight] = useState("")
    const [inversions, setInversions] = useState("")
    const [duration, setDuration] = useState("")

    const [validated, setValidated] = useState(false);

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        const form = event.currentTarget
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            Axios.post(backendServer("/addAttraction"), {
                name: name,
                themepark: themepark,
                opening: opening,
                Builder: builder,
                type: type,
                length: length,
                height: height,
                inversions: inversions,
                duration: duration,
            }).then((response) => {
                if (response.data.registered) {
                    navigate("/home")
                }
            }).catch(function (error) {
                if (error.response) {
                    //setError(error.response.data.error)
                }
            })
        }
        setValidated(true);
    }

    interface textField{
        label:string;
        required:boolean;
        invalidFeedback:string;
    }

    function InputText(props:textField){
        <Form.Group>
        <Form.Label> {props.label}</Form.Label>
        <Form.Control required={props.required} type="text" />
        <Form.Control.Feedback type="invalid">
            Name is required
        </Form.Control.Feedback>
    </Form.Group>
    }

    // length, height, duration : zal nog gevalideerd worden dat echt cijfer is  : https://codesandbox.io/s/9zjo1lp86w?file=/src/Components/InputDecimal.jsx
    // row moet rond card want anders krijg je een lelijke gap tussen header en de card
    return (
        <div className="ContentOfPage">
            <h1>Add an Attraction</h1>
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
                                <Col>
                                    <Form.Group>
                                        <Form.Label>Theme park*</Form.Label>
                                        <Form.Control required type="text" onChange={(e) => setThemepark(e.target.value)} />
                                        <Form.Control.Feedback type="invalid">
                                            Theme park is required
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
                                <Col>
                                    <Form.Group>
                                        <Form.Label>Builder</Form.Label>
                                        <Form.Control type="text" onChange={(e) => setBuilder(e.target.value)} />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group>
                                        <Form.Label >Type</Form.Label>
                                        <InputGroup><Form.Check label="flat ride" /> </InputGroup>
                                        <InputGroup><Form.Check label="steel coaster" /> </InputGroup>
                                        <InputGroup><Form.Check label="wooden coaster" /> </InputGroup>
                                        <InputGroup><Form.Check label="standing coaster" /> </InputGroup>
                                        <InputGroup><Form.Check label="sitdown coaster" /> </InputGroup>
                                        <InputGroup><Form.Check label="launch coaster" /> </InputGroup>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Row>
                                        <Form.Group>
                                            <Form.Label>Length</Form.Label>
                                            <Form.Control type="text" pattern="[0-9]*?(:[.|,][0-9]*)?" placeholder="13,13" onChange={(e) => setLength(e.target.value)} />
                                            <Form.Control.Feedback type="invalid">
                                                The attraction's length should consist of only numbers (you can write decimals by using . or ,).
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Row>
                                    <Row>
                                        <Form.Group>
                                            <Form.Label>Height </Form.Label>
                                            <Form.Control type="text" pattern="[0-9]*?(:[.|,][0-9]*)?" placeholder="13,13" onChange={(e) => setHeight(e.target.value)} />
                                            <Form.Control.Feedback type="invalid">
                                                The attraction's height should consist of only numbers (you can write decimals by using . or ,).
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Row>
                                </Col>
                            </Row>

                            <Row lg={2} sm={1}>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>Inversions </Form.Label>
                                        <Form.Control type="number" min="0" onChange={(e) => setInversions(e.target.value)} />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>Duration</Form.Label>
                                        <Form.Control type="duration" pattern="[0-9]{2}:[0-9]{2}:[0-9]{2}" placeholder="hh:mm:ss" onChange={(e) => setDuration(e.target.value)} />
                                        <Form.Control.Feedback type="invalid">
                                            The attraction's duration should be in terms of hours, minutes and seconds (you can write it like this: 00:00:00).
                                        </Form.Control.Feedback>
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

export default AddAttraction;