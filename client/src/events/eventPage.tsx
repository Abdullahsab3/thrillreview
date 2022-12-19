import { Form, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { Event } from "./Event";
import { Table, Button } from "react-bootstrap";
import { loggedIn } from '../localStorageProcessing';
import { setConstantValue } from "typescript";
import { backendServer } from "../helpers";

function EventPage() {
    const [event, setEvent] = useState<Event>();
    const [error, setError] = useState("");
    const { eventId } = useParams();
    var user: Boolean = loggedIn();
    const [numberOfUsers, setNumberOfUsers] = useState(0);


    useEffect(() => {
        getEventInfo()
        getNumberOfUsers()
    }, [])

    function getEventInfo() {
        axios.get(`/event/${eventId}`).then((res) => {
            console.log("event:", res)
            const { date, description, hour, id, name, themepark } = res.data
            setEvent(new Event(id, name, date, hour, themepark, description));
        }).catch(function (error: any) {
            setError(error.response.data);
        })
    };

    function getNumberOfUsers() {
        axios.get(backendServer(`/event/${eventId}/attendees/count`)).then((res) => {
            setNumberOfUsers(res.data.result)
        });
    }

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

    function joinEventHandler() {
        setNumberOfUsers(numberOfUsers + 1);
        axios.post(backendServer(`/event/${eventId}/join`))
    }

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

                {user ? <Button onClick={joinEventHandler}> Join event </Button> : ""}

            </div>
        );
    } else {
        return (<h1 className="title">No event found with ID {eventId}</h1>);
    }

}

export default EventPage;