import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { Event } from "./Event";
import { Table } from "react-bootstrap";

function EventPage() {
    const [event, setEvent] = useState<Event>();
    const [error, setError] = useState("");
    const { eventId } = useParams();

    useEffect(() => {
        getEventInfo()
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

    if (event) {
        return (
            <div>
                <h1 className="title">{event?.name}</h1>
                <Table className="table" id="infoCard">
                    <tbody>
                        {createDataRows()}
                    </tbody>
                </Table>
            </div>
        );
    } else {
        return (<h1 className="title">No event found with ID {eventId}</h1>);
    }

}

export default EventPage;