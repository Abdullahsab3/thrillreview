import { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { useParams, Link } from "react-router-dom";
import { Card, ListGroup, Button, InputGroup, Form } from 'react-bootstrap';
import { Search } from 'react-bootstrap-icons';
import "../styling/browsingPage.css";
import { Event } from './Event';
import { ErrorCard, LoadingCard, NoMatchesCard } from '../higherOrderComponents/generalCardsForBrowsing';

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

function isIdInArray(a: Event[], i: number): Boolean {
    let res = false;
    a.forEach(t => {
        if (t.id === i) res = true;
    });
    return res;
}

// took inspiration from https://www.youtube.com/watch?v=NZKUirTtxcg
function GetEvents(query: string, pageNr: number) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [events, setEvents] = useState<Event[]>([]);
    const LIMIT_RETURNS = 6;

    // to set events to empty
    useEffect(() => {
        setEvents([]);
    }, [query])
    // to load new events
    useEffect(() => {
        setLoading(true)
        setError(false)
        axios.get(`/events/find?query=${query}&page=${pageNr}&limit=${LIMIT_RETURNS}`).then(res => {
            console.log("res:", res);
            let prevEvents = events;
            if (pageNr <= 1) {
                prevEvents = [];
            }
            res.data.result.map((e: any) => {
                const { name, date, hour, themepark, description, id } = e

                if (!isIdInArray(prevEvents, id))
                    prevEvents.push(new Event(id, name, date, hour, themepark, description));
            });
            setEvents(prevEvents);
            setHasMore(res.data.result.length === LIMIT_RETURNS);
            setLoading(false);
        }).catch(e => {
            setLoading(false)
            setError(true);
        })
    }, [query, pageNr]);

    return (
        { events, hasMore, loading, error }
    );
}

function BrowseEvents() {
    const { initialQuery } = useParams()
    console.log(initialQuery)
    const [query, setQuery] = useState("")
    const [intermediateQuery, setIntermediateQuery] = useState("")
    const [pageNr, setPageNr] = useState(1);
    if (initialQuery) setQuery(initialQuery)
    let { events, hasMore, loading, error } = GetEvents(query, pageNr);
    const observer = useRef<IntersectionObserver | null>(null);  // zonder de null (in type en in haakjes) werkte het niet, dit werkte ook niet : useRef() as React.MutableRefObject<HTMLDivElement>; 
    const lastEventRef = useCallback((node: HTMLDivElement) => {
        if (loading) return // otherwise will keep sending callbacks while loading
        // https://github.com/WebDevSimplified/React-Infinite-Scrolling/blob/master/src/App.js 
        if (observer.current) observer.current.disconnect(); // disconnect current observer to connect a new one
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) { // ref is showing on the page + there is still more
                setPageNr(prevPageNr => prevPageNr + 1)
            }
        })
        if (node) observer.current.observe(node)
    }, [loading, hasMore])



    function handleSubmit(Event: React.FormEvent<HTMLFormElement>) {
        setPageNr(1);
        setQuery(intermediateQuery)
        Event.preventDefault()
    }

    return (
        <>
            <Card className="browsingCard">
                <Card.Body>
                    <Card.Title>Search Events</Card.Title>
                    <Card.Text> Find the event you are looking for! </Card.Text>
                    <Form onSubmit={handleSubmit}>
                        <InputGroup>
                            <Form.Control type="search" onChange={(e) => setIntermediateQuery(e.target.value)} placeholder="Search" />
                            <Button type="submit">
                                <Search />
                            </Button>
                        </InputGroup>
                    </Form>

                </Card.Body>
            </Card>

            {events.length ?
                events.map((event: Event, i: number) => {
                    if (events.length === i + 1) {
                        return (
                            <EventPreviewCard refs={lastEventRef} key={event.id} id={event.id} name={event.name} date={event.date} />
                        );
                    } else {
                        return (
                            <EventPreviewCard key={event.id} id={event.id} name={event.name} date={event.date} />
                        );
                    }
                }) :
                <NoMatchesCard topic={"events"} topicSingular={"event"} />}
            {loading ? <LoadingCard topic={"events"} /> : ""}
            {error ? <ErrorCard topic={"events"} /> : ""}

        </>
    );

}


export default BrowseEvents;