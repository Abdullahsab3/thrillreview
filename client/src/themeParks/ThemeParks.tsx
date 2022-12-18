import CardWithLinkTo from '../higherOrderComponents/cardWithLinkTo';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import { Link } from 'react-router-dom';
import { Search } from 'react-bootstrap-icons';
import { useState } from 'react';

function ThemePark() {
    function SearchThemeParks() {
        const [query, setquery] = useState("")
        return (
            <Card>
                <Card.Body>
                    <Card.Title>Search Theme Parks</Card.Title>
                    <Card.Text> Find the theme park you are looking for! </Card.Text>
                    <Form>
                        <InputGroup>
                            <Form.Control type="search" onChange={(e) => setquery(e.target.value)} placeholder="Search" />
                            <Link to={`/browse-themeparks/${query}`}>        
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
        <div className="ContentOfPage">
            <h1> themeparks</h1>
            <CardWithLinkTo to="/browse-themeparks/" title="Browse all Theme parks"/>
            <CardWithLinkTo to="/addThemePark" title="Add a ThemePark" />

        </div>
    );
}

export default ThemePark;