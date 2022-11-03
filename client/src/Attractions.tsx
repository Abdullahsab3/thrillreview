import { Col } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {Search} from 'react-bootstrap-icons';
import InputGroup from 'react-bootstrap/InputGroup';
import {useState } from 'react';

function Attractions() {

    function TopTenAttractions() {

        return(
            <Card>
                <Card.Body>
                    <Card.Title>Top Ten Attractions Rated by our users</Card.Title>
                    <Card.Text> Ik vermoed dat hier dan de top 10 komt, queryen naar serverside wss </Card.Text>
                </Card.Body>
            </Card>
        );
    }

    function NewestAttractions() {
        return(
            <Card>
                <Card.Body>
                    <Card.Title>Newest Attractions</Card.Title>
                    <Card.Text> Ik vermoed dat hier dan de nieuwe komen, queryen naar serverside wss </Card.Text>
                </Card.Body>
            </Card>
        );
    }

    function SearchAttractions() {
        const[query, setquery] = useState("")
        function handleSubmit () {
            if(query==''){
                alert('you have to specify what you\'re looking for if you ever want to find it')
            } else {
            alert('you searched for ' + query + ', someday this will become a server request')
            }
        }

        return(
            <Card>
                <Card.Body>
                    <Card.Title>Search Attractions</Card.Title>
                    <Card.Text> een zoekding, queryen naar serverside 
                        <Form onSubmit={handleSubmit}>
                        <InputGroup>
                        <Form.Control type="text" onChange={(e) => setquery(e.target.value)} placeholder="Search" />
                        <Button type="submit">
                        <Search />
                        </Button>
                        </InputGroup>
                        </Form>
                    </Card.Text>
                </Card.Body>
            </Card>
        );
    }

    function AddAttraction() {
        return(
            <Card>
                <Card.Body>
                    <Card.Title>Add an attraction</Card.Title>
                    <Card.Text> hier komt een link naar de add pagina</Card.Text>
                </Card.Body>
            </Card>
        );
    }   

    return (
        <div className='ContentOfPage'>
            <h1>attractions</h1>
        <Row lg={3} sm={1}>
            <Col className="AttractionCol">
            <SearchAttractions />
            </Col>
            <Col className="AttractionCol">
            <TopTenAttractions />
            </Col>
            <Col className="AttractionCol">
            <NewestAttractions />
            </Col>
        </Row>
        <Row lg={3} sm={1}>
            <Col className="AttractionCol">
                <AddAttraction />
            </Col>
        </Row>
        </div>

    );
}

export default Attractions;