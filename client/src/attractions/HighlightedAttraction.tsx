import {Card, Table, Button } from 'react-bootstrap';
import StarRating from "./starRating";
import { Attraction, getAttractionRating } from "./Attraction";
import { backendServer } from "../helpers";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import './styling/HighlightedAttraction.css';


function HighLightedAttraction() {
    const [attraction, setAttraction] = useState<Attraction>();
    const [rating, setRating] = useState(0);
    const [randomId, setRandomId] = useState(0);
    const [error, setError] = useState("");

    // request the number of attractions to pick a random id
    useEffect(() => {
        axios.get(backendServer('/attraction/count')).then((res) => {
            const maxId = res.data.result;
            // random between 1 and max : random[0;1] * (max + 1 - 1) + min = random[0;1] * max + min
            setRandomId(Math.random() * maxId + 1)
        });

    }, [])

    // when there is a random id (not zero), render it
    useEffect(() => {
        if (randomId) {
            axios.get(backendServer(`/attraction/${randomId}`)).then((res) => {
                const { name, themepark, themeparkID, openingdate, builder, type, height, length, inversions, duration, id } = res.data
                setAttraction(new Attraction(name, themepark, themeparkID, openingdate, builder, type, height, length, inversions, duration, id))
            }).catch((error: any) => {
                setError(error.response.data);
            })
            getAttractionRating(randomId, function (rating, total, error) {
                setRating(rating);
            })
        }
    }, [randomId])

    // create the data rows for the table of the attraction information
    function createDataRows() {
        const rows = [];
        const info = ["name", "themepark", "type", "height", "lenght", "inversions", "duration"];
        const data = [attraction?.name, attraction?.themepark, attraction?.type, attraction?.height, attraction?.length, attraction?.inversions, attraction?.duration].map((attribute) => {
            if (attribute) return attribute;
            else return "No information found";
        });
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

    return (
        <Card className="highlightCard">
            <Card.Body className="d-flex flex-column justify-content-center  align-items-center">
                <Card.Title> Highlight </Card.Title>
                <Card.Text> A new attraction for you... at every refresh!</Card.Text>
                <StarRating rating={rating} />
                <Table>
                    <tbody>
                        {createDataRows()}
                    </tbody>
                </Table>
                <Link to={`/attractions/${randomId}`}>
                    <Button> Go to attraction! </Button>
                </Link>
            </Card.Body>
        </Card>
    );

}

export default HighLightedAttraction;