import { Card } from 'react-bootstrap';
import "../styling/browsingPage.css";

// information needed
interface browsingInfoCardInterface{
    topic:string;
    topicSingular?:string;
}

// when the results are still loading
export function LoadingCard(props: browsingInfoCardInterface) {
    return (
        <Card className="browsingCard mb-2">
            <Card.Title> We are loading the {props.topic}, please wait</Card.Title>
            <Card.Body> In the mean time, grab some tea! </Card.Body>
        </Card>
    );
}

// when there is an error
export function ErrorCard(props: browsingInfoCardInterface) {
    return (
        <Card bg="danger" className="browsingCard mb-2" >
            <Card.Title> There has been a problem loading the {props.topic}. Please try again.</Card.Title>
            <Card.Body> Our apologies for the inconvenience. </Card.Body>
        </Card>
    );
}

// when there are not matches to the query
export function NoMatchesCard(props: browsingInfoCardInterface) {
    return(
        <Card className="browsingCard mb-2">
            <Card.Title> We did not find any {props.topic} that matched your search</Card.Title>
            <Card.Body> Try a different query, or add the {props.topicSingular} you are looking for!</Card.Body>
        </Card>
    );
}
