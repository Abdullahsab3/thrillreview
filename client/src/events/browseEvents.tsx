import { useEffect, useState, useRef, useCallback, MutableRefObject } from 'react';
import axios, { Canceler, CancelTokenSource } from 'axios';
import { useParams, Link } from "react-router-dom";
import { Card, ListGroup, Button, InputGroup, Form } from 'react-bootstrap';
import { Search } from 'react-bootstrap-icons';
import "../styling/browsingPage.css";
import { Event } from './Event';
import { ErrorCard, LoadingCard} from '../higherOrderComponents/generalCardsForBrowsing';

interface eventPreviewInterface {
    id: number,
    name: string,
    event: string,
    key:number,
    ref?: (e: HTMLDivElement) => void,
}

function EventPreviewCard(props: eventPreviewInterface) {
    return (
        <Card className="browsingCard">
            <Card.Title>{props.name}</Card.Title>
            <ListGroup className="list-group-flush">
                <ListGroup.Item>Event: {props.event}</ListGroup.Item>
            </ListGroup>
            <Card.Body>
                <Link to={`/Events/${props.id}`}>
                    <Button>
                        Go to Event!
                    </Button>
                </Link>
            </Card.Body>
        </Card>
    );
}

// took inspiration from https://www.youtube.com/watch?v=NZKUirTtxcg
function GetEvents(query: string, pageNr: number) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [events, setEvents] = useState<Event[]>([]);

    // to set events to empty
    useEffect(() => {
        setEvents([]);
    }, [query])
    // to load new events
    useEffect(() => {
        setLoading(true)
        setError(false)
        let cancel: Canceler
        axios({
            method: 'get',
            url: "HIER MOET DE URL KOMEN - BACKEND",
            params: { query: query, pagenr: pageNr },
            cancelToken: new axios.CancelToken(c => cancel = c)
        }).then(res => {
            setEvents(prevEvents => {
                return [...prevEvents, ...res.data.events.map((a: any) => { // Event evt andere naam (afh v response) + DIE ANY MOET IETS ANDERS ZIJN, WSS JSON, Q AAN SERVER
                    const { name, date, hour, themepark, description, id } = a
                    new Event(name, date, hour, themepark, description, id)
                })]
            })
            setHasMore(res.data.docs.lenght > 0);
            setLoading(false)
            console.log(res.data);
        }).catch(e => {
            if (axios.isCancel(e)) return // if cancelled, it was meant to
            setLoading(false)
            setError(true);
        })
        return () => cancel();
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
    // HIER EEN PROBLEEM HEB AL VEEL GEKEKEN MAAR VIND HET NIET
    const observer = useRef<IntersectionObserver | null>(null);  // zonder de null (in type en in haakjes) werkte het niet, dit werkte ook niet : useRef() as React.MutableRefObject<HTMLDivElement>; 
    const lastEventRef = useCallback((node: HTMLDivElement) => {
        if (loading) return // otherwise will keep sending callbacks while loading
        console.log(node)
        // DIT HIER GEEFT MIJ FOUTEN, MAAR IS WAT JE MOET DOEN MET SERVER ANTW DUS KAN HET NOG NIET DOEN
        // https://github.com/WebDevSimplified/React-Infinite-Scrolling/blob/master/src/App.js 
            if (observer.current) observer.current.disconnect(); // disconnect current observer to connect a new one
          observer.current = new IntersectionObserver(entries => {
              if (entries[0].isIntersecting && hasMore) { // ref is showing on the page + there is still more
                  setPageNr(prevPageNr => prevPageNr + 1)
              }
          })
          if (node) observer.current.observe(node) 
    }, [loading, hasMore])

    //  OM TE TESTEN ZONDER BACKEND
    events = [new Event(0, "my amazing event", "29/01/2003", "09:00", "walibi", "this is an event wowhow what a description this needs to be long enough to actually test whaoopdfi kdsfjkldjkfsd ty gty kdjmfskdhkfdjhdqff")]
    

    function handleSubmit(Event: React.FormEvent<HTMLFormElement>) {
        setPageNr(1);
        setQuery(intermediateQuery)
        Event.preventDefault()
    }

    //Q : zou ik iedere keer opnieuw laten linken zodat de query update in de link?
    //  <Link to={`/browse-events/${query}`}>   </Link> rond submit knop
    // nadeel: elke keer via routing
    // voordeel: link wordt geupdatet
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

            {events.map((event: Event, i: number) => {
                if (events.length === i + 1) {
                    // HET KAN ZIJN DAT DE REF NIET WERKT, (zie error in console log, maar is v react router dom en ref is v react, dus idk - kan niet testen want moet dan iets v backend krijgen)
                    return (
                        <EventPreviewCard ref={lastEventRef} key={event.id} id={event.id} name={event.name} event={"test"} />
                    );
                } else {
                    return(
                        <EventPreviewCard key={event.id} id={event.id} name={event.name} event={"test"} />
                    );
                }
            })}
            {loading ? <LoadingCard  topic={"events"}/> : ""}
            {error ? <ErrorCard topic={"events"}/> : ""}
           
        </>
    );

}


export default BrowseEvents;