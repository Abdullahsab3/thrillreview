import { Col } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Search } from 'react-bootstrap-icons';
import InputGroup from 'react-bootstrap/InputGroup';
import { useState } from 'react';
import CardWithLinkTo from '../higherOrderComponents/HigherOrderComponents';
import { Link } from 'react-router-dom';

function Attractions() {

    function TopTenAttractions() {

        return (
            <Card>
                <Card.Body>
                    <Card.Title>Top Ten Attractions Rated by our users</Card.Title>
                    <Card.Text> there will be a top 10, when there are users! </Card.Text>
                </Card.Body>
            </Card>
        );
    }

    function NewestAttractions() {
        return (
            <Card>
                <Card.Body>
                    <Card.Title>Newest Attractions</Card.Title>
                    <Card.Text> Once we added attractions, we will show you the newest! </Card.Text>
                </Card.Body>
            </Card>
        );
    }

    function SearchAttractions() {
        const [query, setquery] = useState("")


        function handleSubmit() {
            if (query) {
                alert('you searched for ' + query + ', someday this will become a server request')
            } else {
                alert('you have to specify what you\'re looking for if you ever want to find it')
            }
        }

        return (
            <Card>
                <Card.Body>
                    <Card.Title>Search Attractions</Card.Title>
                    <Card.Text> Find the attraction you are looking for! </Card.Text>
                    <Form onSubmit={handleSubmit}>
                        <InputGroup>
                            <Form.Control type="search" onChange={(e) => setquery(e.target.value)} placeholder="Search" />
                            <Link to={`/browse-attractions/${query}`}>        
                            <Button type="submit">
                                <Search />
                            </Button>   
                            </Link>
                        </InputGroup>
                    </Form>

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
                    <CardWithLinkTo to="/add-attraction" title="Add an attraction" />
                </Col>
            </Row>
        </div>

    );
}

export default Attractions;