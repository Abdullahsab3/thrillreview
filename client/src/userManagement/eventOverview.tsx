import axios from 'axios';
import { useEffect, useState } from 'react';
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
    const [pageNr, setPageNr] = useState(1);
    const [events, setEvents] = useState<eventInfoInterface[]>([]);
    const [hasMore, setHasMore] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const LIMIT_RETURNS = 6;

    function isIdInArray(a: eventInfoInterface[], i: number): Boolean {
        let res = false;
        a.forEach(t => {
            if (t.id === i) res = true;
        });
        return res;
    }

    useEffect(() => {
        axios.get(backendServer(`/events/userJoined?limit=${LIMIT_RETURNS}&page=${pageNr}`)).then((res) => {
            console.log("lim then page", res)
            // i get eventID en userID
            let prevEvents: eventInfoInterface[] = events;
            if (pageNr <= 1) {
                prevEvents = [];
            }
            res.data.result.map((info: any) => {
                const { eventID, name, themepark, date } = info;
                if (!isIdInArray(prevEvents, eventID))
                    prevEvents.push({ id: eventID, eventName: name, themepark: themepark, date: date});
            })
            setEvents(prevEvents);
            setHasMore(res.data.result.length === LIMIT_RETURNS);
            setLoading(false);
        }).catch(e => {
            setLoading(false)
            setError(true);
        })
    }, [pageNr]);


    return (
        <Card className="eventOverview">
            <Card.Title> An Overview of all your events</Card.Title>
            <Card.Text>user: {props.userId}</Card.Text>
            <ListGroup variant="flush">
                {events.map((ev: eventInfoInterface) => {
                    return  <ListGroup.Item key={ev.id}>an event called <a href={getThrillreviewWebsiteLink('Events/' + ev.id)}>{ev.eventName}</a>, on the {ev.date} in {ev.themepark}</ListGroup.Item>;
                })}
          
            </ListGroup>
        </Card>
    );
}

export default EventOverviewCard;