import Axios from "axios"
import { useState } from "react"
import { useParams } from "react-router-dom"
import { Attraction } from "./Attraction"
import { backendServer } from "../helpers"
import { Card, Table } from "react-bootstrap"
import "./styling/attractionPage.css"

export default function AttractionPage() {
    const [attraction, setAttraction] = useState<Attraction>()
    const [error, setError] = useState("")

    const { attractionID } = useParams()

    Axios.post(backendServer("/getAttraction"), {
        attractionID: attractionID
    }).then((res) => {
        console.log(res)
        if (res.data.error) {
            setError(res.data.attractionID)
        } else {
            const { name, themepark, openingdate, builder, type, height, length, inversions, duration, id } = res.data
            setAttraction(new Attraction(name, themepark, openingdate, builder, type, height, length, inversions, duration, id))
        }
    }).catch(function (error: any) {
        setError(error.response.data)
    })

    function getInformationCard() {
        return (
            <Table className="table" id="attractionInfoCard">
                <tbody>
                    <tr>
                        <th className="info">Themepark: </th>
                        <td>{attraction?.themepark}</td>
                    </tr>
                    <tr>
                        <th className="info">Opening Date: </th>
                        <td>{attraction?.openingdate ? attraction?.openingdate : "No information found"}</td>
                    </tr>
                    <tr>
                        <th className="info">Builder: </th>
                        <td>{attraction?.builder ? attraction?.builder : "No information found"}</td>
                    </tr>
                    <tr>
                        <th className="info">Type: </th>
                        <td>{attraction?.type ? attraction?.type : "No information found"}</td>
                    </tr>
                    <tr>
                        <th className="info">Height: </th>
                        <td>{attraction?.height ? attraction?.height : "No information found"}</td>
                    </tr>
                    <tr>
                        <th className="info">Length: </th>
                        <td>{attraction?.length ? attraction?.length : "No information found"}</td>
                    </tr>
                    <tr>
                        <th className="info">Inversions: </th>
                        <td>{attraction?.inversions ? attraction?.inversions  : "No information found"}</td>
                    </tr>
                    <tr>
                        <th className="info">Duration: </th>
                        <td>{attraction?.duration ? attraction?.duration : "No information found"}</td>
                    </tr>
                </tbody>


            </Table>
        )
    }
    return (
        <div className="AttractionPage">
            <h1>{attraction?.name}</h1>
            {getInformationCard()}
        </div>)

}