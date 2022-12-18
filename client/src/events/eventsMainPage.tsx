import CardWithLinkTo from '../higherOrderComponents/cardWithLinkTo';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import { Link } from 'react-router-dom';
import { Search } from 'react-bootstrap-icons';
import { useState } from 'react';

function EventsMainPage() {
    function SearchEvents() {
        const [query, setquery] = useState("")
        return (
            <Card>
                <Card.Body>
                    <Card.Title>Search Events</Card.Title>
                    <Card.Text> Find the events you are looking for! </Card.Text>
                    <Form>
                        <InputGroup>
                            <Form.Control type="search" onChange={(e) => setquery(e.target.value)} placeholder="Search" />
                            <Link to={`/browse-events/${query}`}>        
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

// <SearchEvents />
    return (
        <div className="ContentOfPage">
            <h1> Events</h1>
            
            <CardWithLinkTo to="/browse-events/" title="Browse all Events"/>
            <CardWithLinkTo to="/addEvent" title="Add an Event" />

        </div>
    );
}

export default EventsMainPage;