import Axios from "axios"
import { useState } from "react"
import { useParams } from "react-router-dom"
import { Attraction } from "./Attraction"
import { backendServer } from "../helpers"

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
        console.log(error)
        setError(error.response.data)
    })
    return (
        <div>
            {error ? error : JSON.stringify(attraction)}
        </div>)

}