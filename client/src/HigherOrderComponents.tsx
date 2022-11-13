import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

interface LinkToPage {
    to: string;
    title: string
}
function CardWithLinkTo(props: LinkToPage) {
    return (
        <Card>
            <Card.Body>
                <Card.Title>{props.title}</Card.Title>
                <Link to={props.to}>
                    <Button>Go to page</Button>
                </Link>
            </Card.Body>
        </Card>
    );
}


export default CardWithLinkTo;