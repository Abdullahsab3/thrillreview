import Axios from "axios"
import { useState } from "react"
import { useParams } from "react-router-dom"
import { Attraction } from "./Attraction"
import { backendServer } from "../helpers"
import { Card, Table } from "react-bootstrap"
import "./styling/attractionPage.css"
import Reviews from "./Reviews"

export default function AttractionPage() {
    const [attraction, setAttraction] = useState<Attraction>()
    const [error, setError] = useState("")

    const { attractionID } = useParams()

    Axios.get(backendServer(`/attraction/${attractionID}`)).then((res) => {
        // HIER EEN BUG: STUUR IETS VOOR DE LEGE DINGEN IPV NIETS
        const { name, themepark, openingdate, builder, type, height, length, inversions, duration, id } = res.data
        setAttraction(new Attraction(name, themepark, openingdate, builder, type, height, length, inversions, duration, id))
    }).catch(function (error: any) {
        setError(error.response.data)
    })



    function getInformationCard() {
        return (
            <div className="d-flex flex-column">
                <div className="col d-flex justify-content-right">
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
                                <td>{attraction?.inversions ? attraction?.inversions : "No information found"}</td>
                            </tr>
                            <tr>
                                <th className="info">Duration: </th>
                                <td>{attraction?.duration ? attraction?.duration : "No information found"}</td>
                            </tr>
                        </tbody>


                    </Table>
                </div>
                <div className="col d-flex justify-content-right">

                    <Reviews attractionID={attractionID as string} />

                </div>
            </div>
        )
    }
    return (
        <div className="AttractionPage">
            <h1 className="title">{attraction ? attraction?.name : `No attraction found with ID ${attractionID}`}</h1>
            {attraction && getInformationCard()}
        </div>)

}