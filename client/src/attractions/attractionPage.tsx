import Axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Attraction, getAttractionRating } from "./Attraction"
import { backendServer } from "../helpers"
import { Button, Modal, Table } from "react-bootstrap"
import "./styling/attractionPage.css"
import Reviews from "./Reviews"
import AttractionInputForm from "./attractionInputForm"
import StarRating from "./starRating"
import AttractionImages from "./attractionImages"
import { trackPromise, usePromiseTracker } from "react-promise-tracker"

export default function AttractionPage() {
    const [attraction, setAttraction] = useState<Attraction>()
    const [rating, setRating] = useState(0)
    const [total, setTotal] = useState(0)
    const [error, setError] = useState("")
    const [validated, setValidated] = useState(false)
    const [edit, setEdit] = useState(false)

    const {promiseInProgress} = usePromiseTracker()


    const { attractionID } = useParams()

    function getAttractioninfo() {
        trackPromise(
            Axios.get(backendServer(`/attraction/${attractionID}`)).then((res) => {
                const { name, themepark, themeparkID, openingdate, builder, type, height, length, inversions, duration, id } = res.data
                setAttraction(new Attraction(name, themepark, themeparkID, openingdate, builder, type, height, length, inversions, duration, id))
            }).catch(function (error: any) {
                setError(error.response.data)
            })
        )
        getAttractionRating(parseInt(attractionID as string), function (rating, total ,error) {
            if(error) {
                setError(error)
            } else {
                setRating(rating);
                setTotal(total)
            }
        })
    }

    useEffect(() => {
        getAttractioninfo()
    }, [])

    function submitEdits(attraction: Attraction, images: File[]) {
        const updateAttractionInfo: React.FormEventHandler<HTMLFormElement> =
            (event: React.FormEvent<HTMLFormElement>) => {
                event.preventDefault()
                Axios.put(backendServer(`/attraction/${attractionID}`), attraction.toJSON()).then((res) => {
                    if (res.data.updated) {
                        images.forEach((image) => {
                            const formData = new FormData();
                            formData.append(`image`, image);
                            Axios.post(backendServer(`/attraction/${attractionID}/photos`), formData, {
                                headers: {
                                    'Content-Type': 'multipart/form-data'
                                }
                            }).then((res) => {
                                if (res.data.updated) {
                                    getAttractioninfo()
                                    setValidated(true)
                                    setEdit(false)
                                }
                            }).catch(function (error) {
                                setError(error.response.data)
                            })
                        })

                    }
                }).catch((error) => {
                    setError(error.response.data)
                })
            }
        return (updateAttractionInfo)

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

    function createDataRows() {
        const rows = []
        for (let i = 0; i < data.length; i++) {
            rows.push(
                <tr key={i}>
                    {info[i]}
                    {data[i]}
                </tr>)
        }
        return (rows)
    }

    function getInformationCard() {
        return (
            <div>
                <Table>
                    <tbody>
                        <tr>
                            <th>
                                Attraction's Information
                            </th>

                        </tr>

                    </tbody>
                </Table>
                <div className="d-flex flex-column">
                    <Table className="table" id="attractionInfoCard">
                        <tbody>
                            {createDataRows()}
                        </tbody>
                    </Table>
                    <Table>
                        <tbody>
                            <tr>
                                <th>
                                    <Button onClick={() => setEdit(true)}>Edit the attraction's information</Button>
                                </th>
                            </tr>
                        </tbody>
                    </Table>

                </div>
            </div>
        )
    }

    function getInformationForm() {
        return (
            <Modal show={edit} onHide={() => setEdit(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit the attraction</Modal.Title>
                </Modal.Header>

                <AttractionInputForm
                    title="Edit the attractions information"
                    text="Here you can edit the information of this attraction"
                    attraction={attraction as Attraction}
                    onFormSubmit={submitEdits}
                    validated={validated} />
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setEdit(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }

    function AttractionPageBody() {
        return (
            <div>
                <div className="AttractionTitle d-flex flex-column justify-content-center">
                    <h1 className="title">{attraction?.name}
                    </h1>
                        <div className="row mx-auto ratingpreview">
                            <div className="col">
                                <StarRating className="attractionAvgRating" rating={rating} />
                            </div>
                            <div className="col p-3">
                                <p>{total} Reviews</p>
                            </div>
                        </div>
                </div>

                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg">
                            {getInformationCard()}
                            {getInformationForm()}
                        </div>
                        <div className="col-lg">
                            {AttractionImages({ attractionID: parseInt(attractionID as string) })}
                        </div>
                    </div>
                    <div className="row">
                        <Reviews attractionID={parseInt(attractionID as string)} />
                    </div>
                </div>
            </div>
        )

    }
    return (
        <div className="AttractionPage">
            {promiseInProgress ? 
            <i>Loading the attraction</i> : 
                <div>
                    {attraction ? <AttractionPageBody /> : <h1 className="title">{`No attraction found with ID ${attractionID}`}</h1>}
                </div>}
            
        </div>)

}