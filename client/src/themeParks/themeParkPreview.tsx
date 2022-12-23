import { Card, ListGroup, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';


// the information you need
interface themeParkPreviewInterface {
    id: number,
    name: string,
    country: string,
    key: number,
    refs?: (e: HTMLDivElement) => void,
}

// theme park preview card
// last theme park gets a reference
function ThemeParkPreviewCard(props: themeParkPreviewInterface) {
    if (props.refs) {
        return (
            <Card className="browsingCard" ref={props.refs}>
                <Card.Title>{props.name}</Card.Title>
                <ListGroup className="list-group-flush">
                    <ListGroup.Item>Country: {props.country}</ListGroup.Item>
                </ListGroup>
                <Card.Body>
                    <Link to={`/Themeparks/${props.id}`}>
                        <Button>
                            Go to themePark!
                        </Button>
                    </Link>
                </Card.Body>
            </Card>);
    } else {
        return (
            <Card className="browsingCard">
                <Card.Title>{props.name}</Card.Title>
                <ListGroup className="list-group-flush">
                    <ListGroup.Item>Country: {props.country}</ListGroup.Item>
                </ListGroup>
                <Card.Body>
                    <Link to={`/Themeparks/${props.id}`}>
                        <Button>
                            Go to themePark!
                        </Button>
                    </Link>
                </Card.Body>
            </Card>
        );
    }
}

export default ThemeParkPreviewCard;