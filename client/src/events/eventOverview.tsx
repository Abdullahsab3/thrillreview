import axios from 'axios';
import { useEffect, useState, useCallback, useRef } from 'react';
import { Card, ListGroup } from 'react-bootstrap'
import { backendServer, getThrillreviewWebsiteLink } from '../helpers';
import './styling/eventOverview.css';

interface eventOverviewInterface {
    userId: number;
}

interface eventInfoInterface {
    id: number,
    eventName: string,
    themepark: string,
    date: string,
}

function EventOverviewCard(props: eventOverviewInterface) {
    // a couple of constants
    const [pageNr, setPageNr] = useState(1);
    const [events, setEvents] = useState<eventInfoInterface[]>([]);
    const [hasMore, setHasMore] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const LIMIT_RETURNS = 6;

    // whether the id is in the array
    function isIdInArray(a: eventInfoInterface[], i: number): Boolean {
        let res = false;
        a.forEach(t => {
            if (t.id === i) res = true;
        });
        return res;
    }

    // whenever page number changes, request new events
    useEffect(() => {
        axios.get(backendServer(`/events/userJoined?limit=${LIMIT_RETURNS}&page=${pageNr}`)).then((res) => {
            let prevEvents: eventInfoInterface[] = events;
            if (pageNr <= 1) {
                prevEvents = [];
            }
            res.data.result.map((info: any) => {
                const { eventID, name, themepark, date } = info;
                if (!isIdInArray(prevEvents, eventID))
                    prevEvents.push({ id: eventID, eventName: name, themepark: themepark, date: date });
            })
            setEvents(prevEvents);
            setHasMore(res.data.result.length === LIMIT_RETURNS);
            setLoading(false);
        }).catch(e => {
            setLoading(false)
            setError(true);
        })
    }, [pageNr]);

    const observer = useRef<IntersectionObserver | null>(null);
    const lastEventRef = useCallback((node: HTMLAnchorElement) => {
        if (loading) return // otherwise will keep sending callbacks while loading
        // https://github.com/WebDevSimplified/React-Infinite-Scrolling/blob/master/src/App.js 
        if (observer.current) observer.current.disconnect(); // disconnect current observer to connect a new one
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {  
                setPageNr(prevPageNr => prevPageNr + 1);
            }
        })
        if (node) observer.current.observe(node)
    }, [loading, hasMore])

    return (
        <Card className="eventOverview">
            <Card.Title> An Overview of all your events</Card.Title>
            <Card id="eventLisScrollCard">
                <ListGroup variant="flush" id="eventList">
                    {events.map((ev: eventInfoInterface, i: number) => {
                        if (events.length === i + 1)
                            return <ListGroup.Item key={ev.id} ref={lastEventRef}>an event called <a href={getThrillreviewWebsiteLink('Events/' + ev.id)}>{ev.eventName}</a>, on the {ev.date} in {ev.themepark}</ListGroup.Item>;
                        else return <ListGroup.Item key={ev.id}>an event called <a href={getThrillreviewWebsiteLink('Events/' + ev.id)}>{ev.eventName}</a>, on the {ev.date} in {ev.themepark}</ListGroup.Item>;
                    })}

                </ListGroup>
            </Card>
        </Card>
    );
}

export default EventOverviewCard;