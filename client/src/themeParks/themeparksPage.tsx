import Axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { backendServer } from "../helpers"
import { Button, Card, Form, Modal, Table } from "react-bootstrap"
import { ThemePark } from "./themePark"
import ThemeParkInputForm from "./themeParkInputForm"

export default function ThemeParkPage() {
    const [themePark, setThemePark] = useState<ThemePark>()
    const [error, setError] = useState("")
    const [validated, setValidated] = useState(false)
    const [edit, setEdit] = useState(false)


    const { themeParkID } = useParams()

    function getAttractioninfo() {

        Axios.get(backendServer(`/themePark/${themeParkID}`)).then((res) => {
            // HIER EEN BUG: STUUR IETS VOOR DE LEGE DINGEN IPV NIETS
            const { name, openingdate, street, streetNumber, postalCode, country, type, website, id } = res.data
            setThemePark(new ThemePark(name, openingdate, street, streetNumber, postalCode, country, type, website, id))
        }).catch(function (error: any) {
            setError(error.response.data)
        })

    }

    useEffect(() => {
        getAttractioninfo()
    }, [])

    function submitEdits(themePark: ThemePark) {
        const updateAttractionInfo: React.FormEventHandler<HTMLFormElement> =
            (event: React.FormEvent<HTMLFormElement>) => {
                event.preventDefault()
                Axios.put(`/themePark/${themePark}`, themePark.toJSON()).then((res) => {
                    if (res.data.updated) {
                        setValidated(true)
                        setEdit(false)
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
        <th className="info">name: </th>,
        <th className="info">Opening Date: </th>,
        <th className="info">Street: </th>,
        <th className="info">street number: </th>,
        <th className="info">postal Code: </th>,
        <th className="info">country: </th>,
        <th className="info">Type: </th>,
        <th className="info">Website: </th>
    ]
    const data = [

        <td>{themePark?.name}</td>,
        <TableData data={themePark?.openingdate} />,
        <TableData data={themePark?.street} />,
        <TableData data={themePark?.streetNumber} />,
        <TableData data={themePark?.postalCode} />,
        <TableData data={themePark?.country} />,
        <TableData data={themePark?.type} />,
        <TableData data={themePark?.website} />
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
                <div className="AttractionTitle d-flex flex-column justify-content-center">
                    <h1 className="title">{themePark?.name}
                    </h1>
                </div>

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
                                    <Button onClick={() => setEdit(true)}>Edit the themepark's information</Button>
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
            <Modal className="modal-dialog modal-lg" show={edit} onHide={() => setEdit(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit the attraction</Modal.Title>
                </Modal.Header>

                {<ThemeParkInputForm
                    title="Edit the themeparks information"
                    text="Here you can edit the information of this themepark"
                    themepark={themePark as ThemePark}
                    onFormSubmit={submitEdits}
                    validated={validated} />}
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
                {getInformationCard()}
                {getInformationForm()}
            </div>
        )

    }
    return (
        <div className="AttractionPage">
            {themePark ? <AttractionPageBody /> : <h1 className="title">{`No themepark found with ID ${themeParkID}`}</h1>}
        </div>)

}