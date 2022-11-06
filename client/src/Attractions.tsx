import { Col } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {Search} from 'react-bootstrap-icons';
import InputGroup from 'react-bootstrap/InputGroup';
import {useState } from 'react';
import { Link } from 'react-router-dom';

function Attractions() {

    function TopTenAttractions() {

        return(
            <Card>
                <Card.Body>
                    <Card.Title>Top Ten Attractions Rated by our users</Card.Title>
                    <Card.Text> there will be a top 10, when there are users! </Card.Text>
                </Card.Body>
            </Card>
        );
    }

    function NewestAttractions() {
        return(
            <Card>
                <Card.Body>
                    <Card.Title>Newest Attractions</Card.Title>
                    <Card.Text> Once we added attractions, we will show you the newest! </Card.Text>
                </Card.Body>
            </Card>
        );
    }

    function SearchAttractions() {
        const[query, setquery] = useState("")
        function handleSubmit () {
            if (query) {
                alert('you searched for ' + query + ', someday this will become a server request')
            } else {
                alert('you have to specify what you\'re looking for if you ever want to find it')
            }
        }

        return(
            <Card>
                <Card.Body>
                    <Card.Title>Search Attractions</Card.Title>
                    <Card.Text> Find the attraction you are looking for! </Card.Text>
                        <Form onSubmit={handleSubmit}>
                        <InputGroup>
                        <Form.Control type="text" onChange={(e) => setquery(e.target.value)} placeholder="Search" />
                        <Button type="submit">
                        <Search />
                        </Button>
                        </InputGroup>
                        </Form>
                    
                </Card.Body>
            </Card>
        );
    }

    function AddAttraction() {
        return(
            <Card>
                <Card.Body>
                    <Card.Title>Add an attraction</Card.Title>
                    <Link to="/addAttraction">
                    <Button>Add Attraction</Button>
                    </Link>
                    

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