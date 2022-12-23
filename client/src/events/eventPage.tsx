import { Form, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { Event } from "./Event";
import { Table, Button } from "react-bootstrap";
import { loggedIn } from '../localStorageProcessing';
import { backendServer } from "../helpers";

function EventPage() {
    // some constants
    const [event, setEvent] = useState<Event>();
    const [error, setError] = useState("");
    const [joined, setJoined] = useState(false);
    const { eventId } = useParams();
    var user: Boolean = loggedIn();
    const [numberOfUsers, setNumberOfUsers] = useState(0);

    // check whether the user already joined
    useEffect(() => {
        getEventInfo()
        axios.get(backendServer(`/event/${eventId}/userjoined`)).then((res) => {
            setJoined(res.data.result);
        });
    }, [])

    // get number of users
    useEffect(() => {
        getNumberOfUsers();
    }, [joined]);

    // get the info about the event
    function getEventInfo() {
        axios.get(backendServer(`/event/${eventId}`)).then((res) => {
            const { date, description, hour, id, name, themepark } = res.data
            setEvent(new Event(id, name, date, hour, themepark, description));
        }).catch(function (error: any) {
            setError(error.response.data);
        })
    };

    // get the number of users that already joined
    function getNumberOfUsers() {
        axios.get(backendServer(`/event/${eventId}/attendees/count`)).then((res) => {
            setNumberOfUsers(res.data.result);
        });
    }

    // create the data rows for the theme park card
    function createDataRows() {
        const rows = [];
        const info = ["name", "date", "hour", "themepark", "description"];
        const data = [event?.name, event?.date, event?.hour, event?.themepark, event?.description];
        const length = data.length;
        for (let i = 0; i < length; i++) {
            rows.push(
                <tr key={i}>
                    <th className="info">{info[i]}: </th>
                    <td>{data[i]}</td>
                </tr>);
        }
        return rows;
    }

    // handle submit of join event
    function joinEventHandler() {
        axios.post(backendServer(`/event/${eventId}/join`)).then((res) => {
            if (res.data.added) {
                setJoined(res.data.added);
                setNumberOfUsers(numberOfUsers + 1);
            } else alert("Something went wrong and you were not added.")
        }).catch((error) => { alert("Something went wrong and you were not added.") })
    }

    // if there is an event, show it, otherwise say there is no event
    if (event) {
        return (
            <div className="ContentOfPage">
                <h1 className="title">{event?.name}</h1>
                <Table className="table" id="infoCard">
                    <tbody>
                        {createDataRows()}
                    </tbody>
                </Table>
                {(numberOfUsers === 1) ?
                    <p> {numberOfUsers} person is interested </p> :
                    <p> {numberOfUsers} people are interested </p>}

                {user ? <Button disabled={joined} onClick={joinEventHandler}> Join event </Button> : ""}
                {joined ? <p>you joined already</p> : ""}

            </div>
        );
    } else {
        return (<h1 className="title">No event found with ID {eventId}</h1>);
    }

}

export default EventPage;