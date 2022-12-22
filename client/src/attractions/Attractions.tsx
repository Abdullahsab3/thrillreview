import { Col, ListGroup } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import { useEffect, useState } from 'react';
import { CardWithLinkTo } from '../higherOrderComponents/cardWithLinkTo';
import { Link } from 'react-router-dom';
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
    return res;
}

function Attractions() {
    const [topAttractions, setTopAttractions] = useState<AttractionPreviewInfoInterface[]>([]);

    useEffect(() => {
        axios.get(backendServer(`/attraction/top`)).then((res) => {
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
                    <ListGroup>
                        {topAttractions.map((a: AttractionPreviewInfoInterface, i: number) => {
                            return (
                                <Link key={a.id} to={`/Attractions/${a.id}`} >
                                <ListGroup.Item > {i + 1}. {a.name} in {a.themepark} </ListGroup.Item>
                                </Link>
                            );
                        })}
                    </ListGroup>

                </Card.Body>
            </Card>
        );
    }


    return (
        <div className='ContentOfPage'>
            <h1>attractions</h1>
            <Row lg={2} sm={1}>
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
            </Row>
            
        </div>

    );
}

export default Attractions;