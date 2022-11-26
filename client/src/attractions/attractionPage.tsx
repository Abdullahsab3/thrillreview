import Axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Attraction } from "./Attraction"
import { backendServer } from "../helpers"
import { Button, Card, Form, Table } from "react-bootstrap"
import "./styling/attractionPage.css"
import Reviews from "./Reviews"
import {
    NameInputField, DurationInputField, InversionsInputField, HeightInputField, LengthInputField, TypesInputField,
    BuilderInputField, OpeningInputField, ThemeparkInputField
} from "./attractionInputFields"

export default function AttractionPage() {
    const [attraction, setAttraction] = useState<Attraction>()
    const [error, setError] = useState("")
    const [validated, setValidated] = useState(false)
    const [edit, setEdit] = useState(false)


    const { attractionID } = useParams()

    function getAttractioninfo() {

        Axios.get(backendServer(`/attraction/${attractionID}`)).then((res) => {
            // HIER EEN BUG: STUUR IETS VOOR DE LEGE DINGEN IPV NIETS
            const { name, themepark, openingdate, builder, type, height, length, inversions, duration, id } = res.data
            setAttraction(new Attraction(name, themepark, openingdate, builder, type, height, length, inversions, duration, id))
        }).catch(function (error: any) {
            setError(error.response.data)
        })
    }

    useEffect(() => {
        getAttractioninfo()
    }, [])

    function updateAttractionInfo() {
        setAttraction(new Attraction(name, themepark, openingdate, builder, type, height, length, inversions, duration, (parseInt(attractionID as string) as number)))
        Axios.put(`/attraction/${attractionID}`, JSON.stringify(attraction)).then((res) => {
            if (res.data.updated) {
                setValidated(true)
            }
        }).catch((error) => {
            setError(error.response.data)
        })
    }

    interface tableDataProps {
        data: any
    }
    function TableData(props: tableDataProps) {
        return (
            <td>
                {props.data ? props.data : "No information found"}
            </td>
        )
    }


    const [name, setName] = useState("")
    const [themepark, setThemepark] = useState("")
    const [openingdate, setOpeningdate] = useState("")
    const [builder, setBuilder] = useState("")
    const [type, setType] = useState("")
    const [height, setHeight] = useState("")
    const [length, setLength] = useState("")
    const [inversions, setInversions] = useState("")
    const [duration, setDuration] = useState("")

    const info = [
        <th className="info">Themepark: </th>,
        <th className="info">Opening Date: </th>,
        <th className="info">Builder: </th>,
        <th className="info">Type: </th>,
        <th className="info">Height: </th>,
        <th className="info">Length: </th>,
        <th className="info">Inversions: </th>,
        <th className="info">Duration: </th>
    ]
    const data = [
        <td>{attraction?.themepark}</td>,
        <TableData data={attraction?.openingdate} />,
        <TableData data={attraction?.builder} />,
        <TableData data={attraction?.type} />,
        <TableData data={attraction?.height} />,
        <TableData data={attraction?.length} />,
        <TableData data={attraction?.inversions} />,
        <TableData data={attraction?.duration} />
    ]

    const inputField = [
        <ThemeparkInputField onChange={(e) => {
            setThemepark(e.target.value)
        }} value={themepark} />,
        <OpeningInputField onChange={(e) => {
            setOpeningdate(e.target.value)
        }} value={openingdate} />,
        <BuilderInputField onChange={(e) => {
            setBuilder(e.target.value)
        }} value={builder} />,
        <TypesInputField onChange={(e) => {
            setType(e.target.value)
        }} value={type} />,
        <HeightInputField onChange={(e) => {
            setHeight(e.target.value)
        }} value={height} />,
        <LengthInputField onChange={(e) => {
            setLength(e.target.value)
        }} value={length} />,
        <InversionsInputField onChange={(e) => {
            setInversions(e.target.value)
        }} value={inversions} />,
        <DurationInputField onChange={(e) => {
            setDuration(e.target.value)
        }} value={duration} />
    ]


    function createDataRows() {
        const rows = []
        for (let i = 0; i < data.length; i++) {
            rows.push(
                <tr>
                    {info[i]}
                    {data[i]}
                </tr>)
        }
        return (rows)
    }
    useEffect(() => {
        setName(attraction?.name as string)
        setThemepark(attraction?.themepark as string)
        setOpeningdate(attraction?.openingdate as string)
        setBuilder(attraction?.builder as string)
        setType(attraction?.type as string)
        setHeight(attraction?.height as string)
        setLength(attraction?.length as string)
        setInversions(attraction?.inversions as string)
        setDuration(attraction?.duration as string)
    }, [attraction])

    function createInputRows() {


        const rows = []
        for (let i = 0; i < data.length; i++) {
            rows.push(
                <tr>
                    {info[i]}
                    {inputField[i]}
                </tr>
            )
        }
        return (rows)
    }

    function getInformationCard() {
        return (
            <div className="d-flex flex-column">
                <Table className="table" id="attractionInfoCard">
                    <tbody>
                        {edit ?
                            createInputRows() :
                            createDataRows()}
                    </tbody>
                </Table>

                <Table>
                    <tbody>
                        <tr>
                            <th>
                                {edit ?
                                    <Button>Submit your changes</Button> :
                                    <Button onClick={() => setEdit(true)}>Edit the attraction's information</Button>
                                }
                            </th>
                        </tr>
                    </tbody>
                </Table>
            </div>
        )
    }
    return (
        <div className="AttractionPage">
            <Form>
                <div className="AttractionTitle d-flex justify-content-center">
                    {edit ?
                        <NameInputField onChange={(e) => {
                            setName(e.target.value)
                        }} value={attraction?.name as string} /> :
                        <h1 className="title">{attraction ? attraction?.name : `No attraction found with ID ${attractionID}`}
                        </h1>}
                </div>
                {attraction &&
                    <div>
                        {getInformationCard()}
                        <Reviews attractionID={attractionID as string} />
                    </div>}
            </Form>
        </div>)

}