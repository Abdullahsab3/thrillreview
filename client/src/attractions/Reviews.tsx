import Axios from "axios"
import { useState } from "react"
import { backendServer } from "../helpers"

interface ReviewsProps {
    attractionID: string
}
export default function Reviews(props: ReviewsProps) {
    const [Error, setError] = useState("")
    const [reviews, setReviews] = useState([])

    Axios.post(backendServer("/get-attraction-reviews"), {
        attractionID: props.attractionID
    }).then((res) => {
        if (res.data.error) {
            setError(res.data.reviews)
        } else {
            setReviews(res.data.reviews)
        }
    }).catch(function (error: any) {
        setError(error.response.data)
    })

    return (
        <div>

        </div>
    )

}