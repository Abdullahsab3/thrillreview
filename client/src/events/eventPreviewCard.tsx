import { Card, ListGroup, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

interface eventPreviewInterface {
    id: number,
    name: string,
    date: string,
    key: number,
    refs?: (e: HTMLDivElement) => void,
}

function EventPreviewCard(props: eventPreviewInterface) {
    if (props.refs) {
        return (
            <Card ref={props.refs} className="browsingCard">
                <Card.Title>{props.name}</Card.Title>
                <ListGroup className="list-group-flush">
                    <ListGroup.Item>Date: {props.date}</ListGroup.Item>
                </ListGroup>
                <Card.Body>
                    <Link to={`/Events/${props.id}`}>
                        <Button>
                            View Event!
                        </Button>
                    </Link>
                </Card.Body>
            </Card>
        );
    } else {
        return (
            <Card className="browsingCard">
                <Card.Title>{props.name}</Card.Title>
                <ListGroup className="list-group-flush">
                    <ListGroup.Item>Date: {props.date}</ListGroup.Item>
                </ListGroup>
                <Card.Body>
                    <Link to={`/Events/${props.id}`}>
                        <Button>
                            View Event!
                        </Button>
                    </Link>
                </Card.Body>
            </Card>
        );
    };

}
export default EventPreviewCard;