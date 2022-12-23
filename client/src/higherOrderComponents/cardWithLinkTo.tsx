import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import './styling/cardWithLinkTo.css'

// information needed
interface LinkToPage {
    to: string;
    title: string
    className?:string
}

// card with link to that you can specify
export function CardWithLinkTo(props: LinkToPage) {
    return (
        <Card className={props.className ? props.className : "cardWithLinkTo"}>
            <Card.Body>
                <Card.Title>{props.title}</Card.Title>
                <Link to={props.to}>
                    <Button>Go to page</Button>
                </Link>
            </Card.Body>
        </Card>
    );
}

// the card to say that you should login first
export function LoginFirstCard() {
    return  <CardWithLinkTo className="loginCard" to='/Login' title='Please log in first.' />;
}
