import { Card, Dropdown } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';

function AddAttraction() {

    function handleSubmit() {
        alert('whoop whoop')
    }

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
                            <Form.Control type="text"/>
                        </InputGroup>
                        <Form.Group>
                            <Form.Label>theme park*</Form.Label>
                            <Form.Control type="text"/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Opening</Form.Label>
                            <Form.Control type="date"/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Builder</Form.Label>
                            <Form.Control type="text"/>
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
                            <Form.Label>length (zal nog gevalideerd worden dat echt cijfer is)</Form.Label>
                            <Form.Control type="text"/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>height (zal nog gevalideerd worden dat echt cijfer is)</Form.Label> /** https://codesandbox.io/s/9zjo1lp86w?file=/src/Components/InputDecimal.jsx */
                            <Form.Control type="text"/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>inversions </Form.Label>
                            <Form.Control type="number" min="0"/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Duration (zal nog gevalideerd worden dat echt cijfer is)</Form.Label>
                            <Form.Control type="duration" placeholder="00m00s"/>
                        </Form.Group>
                        <Button type="submit">Submit</Button>
                    </Form>
                </Card.Body>
            </Card>
        </div>);
}

export default AddAttraction;