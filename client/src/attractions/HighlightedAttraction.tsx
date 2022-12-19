import { Col, Card, Table  } from 'react-bootstrap';
import AttractionImages from "./attractionImages";
import StarRating from "./starRating";
import { Attraction, getAttractionRating } from "./Attraction";
import { backendServer } from "../helpers";
import { useEffect, useState } from 'react';
import axios from 'axios';


function HighLightedAttraction() {
    const [attraction, setAttraction] = useState<Attraction>();
    const [rating, setRating] = useState(0);
    const [randomId, setRandomId] = useState(0);
    const [error, setError] = useState("");

    useEffect(() => {
        // hier komt nog een axiosRequest
        setRandomId(5);

    }, [])

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
        <Card>
            <Card.Body className="d-flex flex-column justify-content-center  align-items-center">
                <Card.Title> Highlight </Card.Title>
                <Card.Text> A new attraction for you... at every refresh!</Card.Text>
                <Table>
                    {createDataRows()}
                </Table>
                <AttractionImages attractionID={randomId} />
            </Card.Body>
        </Card>
    );

}

export default HighLightedAttraction;