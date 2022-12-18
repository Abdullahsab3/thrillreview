import { Col, ListGroup } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Search } from 'react-bootstrap-icons';
import InputGroup from 'react-bootstrap/InputGroup';
import { useEffect, useState } from 'react';
import CardWithLinkTo from '../higherOrderComponents/HigherOrderComponents';
import { Link } from 'react-router-dom';
import { Attraction } from './Attraction';
import axios from 'axios';
import { backendServer } from '../helpers';


interface AttractionPreviewInfoInterface {
    id: number,
    name: string,
    themepark: string,
}

function isIdInArray(a: AttractionPreviewInfoInterface[], i: number): Boolean {
    let res = false;
    a.forEach(t => {
        if (t.id === i) res = true;
    });
    console.log("id:", i, "a:", a, "res", res)
    return res;
}

function Attractions() {
    const [topAttractions, setTopAttractions] = useState<AttractionPreviewInfoInterface[]>([]);

    useEffect(() => {
        axios.get(backendServer(`/attractions/find?query=&page=0&limit=10`)).then((res) => {
            console.log(res)
            let prevtopAttractions: AttractionPreviewInfoInterface[] = [];
            res.data.result.map((attr: any) => {
                const { name, themepark, id } = attr
                if (!isIdInArray(prevtopAttractions, id)) {
                    const attrInfo = {
                        id: id,
                        name: name,
                        themepark: themepark,
                    }
                    prevtopAttractions.push(attrInfo)
                }
                setTopAttractions(prevtopAttractions);
            });
        }
        )
    }, [])

    function TopTenAttractions() {
        return (
            <Card>
                <Card.Body>
                    <Card.Title>Top Ten Attractions Rated by our users</Card.Title>
                    <ListGroup numbered>
                        {topAttractions.map((a: AttractionPreviewInfoInterface, i: number) => {
                            return (
                                <Link to={`/Attractions/${a.id}`} >
                                <ListGroup.Item> {a.name} in {a.themepark} </ListGroup.Item>
                                </Link>
                            );
                        })}
                    </ListGroup>

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
        return (
            <Card>
                <Card.Body>
                    <Card.Title>Search Attractions</Card.Title>
                    <Card.Text> Find the attraction you are looking for! </Card.Text>
                    <Form>
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
//  <SearchAttractions />
/*<Row lg={3} sm={1}>
                <Col className="AttractionCol">
                   
                </Col>
         </Row> */
    return (
        <div className='ContentOfPage'>
            <h1>attractions</h1>
            <Row lg={3} sm={1}>
                <Col className="AttractionCol">
                   <Row>
                    <CardWithLinkTo to="/browse-attractions/" title="Browse all Attractions"/>
                    </Row>
                    <Row>
                         <CardWithLinkTo to="/add-attraction" title="Add an attraction" />
                    </Row>
                </Col>
                <Col className="AttractionCol">
                    <TopTenAttractions />
                </Col>
                <Col className="AttractionCol">
                    <NewestAttractions />
                </Col>
            </Row>
            
        </div>

    );
}

export default Attractions;