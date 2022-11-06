import { useState } from 'react';
import { Card, Dropdown } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { backendServer } from './helpers';

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
    
    function handleSubmit() {
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
        if(error.response) {
          //setError(error.response.data.error)
        }
      })
      }

    // length, height, duration : zal nog gevalideerd worden dat echt cijfer is  : https://codesandbox.io/s/9zjo1lp86w?file=/src/Components/InputDecimal.jsx

    return (
        <div className="ContentOfPage">
            <h1> Add an Attraction</h1>
            <Card>
                <Card.Body>
                    <Card.Title>Add a new attraction</Card.Title>
                    <Card.Text>Fill in the form to add a new attraction. Please check first if the attraction is not a duplicate.</Card.Text>
                    <Form onSubmit={handleSubmit}>
                        <InputGroup>
                            <Form.Label> name* </Form.Label>
                            <Form.Control type="text" onChange={(e) => setName(e.target.value)}/>
                        </InputGroup>
                        <Form.Group>
                            <Form.Label>theme park*</Form.Label>
                            <Form.Control type="text" onChange={(e) => setThemepark(e.target.value)}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Opening</Form.Label>
                            <Form.Control type="date" onChange={(e) => setOpening(e.target.value)}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Builder</Form.Label>
                            <Form.Control type="text" onChange={(e) => setBuilder(e.target.value)}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>type</Form.Label>
                            <InputGroup><Form.Check label="flat ride"/> </InputGroup>
                            <InputGroup><Form.Check label="steel coaster"/> </InputGroup>
                            <InputGroup><Form.Check label="wooden coaster"/> </InputGroup>
                            <InputGroup><Form.Check label="standing coaster"/> </InputGroup>
                            <InputGroup><Form.Check label="sitdown coaster"/> </InputGroup>
                            <InputGroup><Form.Check label="launch coaster"/> </InputGroup> 

                        </Form.Group>
                        <Form.Group>
                            <Form.Label>length</Form.Label> 
                            <Form.Control type="text" onChange={(e) => setLength(e.target.value)}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>height </Form.Label>  
                            <Form.Control type="text" onChange={(e) => setHeight(e.target.value)}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>inversions </Form.Label>
                            <Form.Control type="number" min="0" onChange={(e) => setInversions(e.target.value)}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Duration</Form.Label> 
                            <Form.Control type="duration" onChange={(e) => setDuration(e.target.value)} placeholder="00m00s"/>
                        </Form.Group>
                        <Button onClick={handleSubmit}>Submit</Button>
                    </Form>
                </Card.Body>
            </Card>
        </div>);
}

export default AddAttraction;