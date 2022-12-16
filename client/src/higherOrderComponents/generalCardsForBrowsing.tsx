import { Card } from 'react-bootstrap';

interface browsingInfoCardInterface{
    topic:string;
}

export function LoadingCard(props: browsingInfoCardInterface) {
    return (
        <Card>
            <Card.Title> We are loading the ${props.topic}, please wait</Card.Title>
            <Card.Body> In the mean time, grab some tea! </Card.Body>
        </Card>
    );
}

export function ErrorCard(props: browsingInfoCardInterface) {
    return (
        <Card bg="danger" className="browsingCard mb-2" >
            <Card.Title> There has been a problem loading the ${props.topic}. Please try again.</Card.Title>
            <Card.Body> Our apologies for the inconvenience. </Card.Body>
        </Card>
    );
}
