import Axios from "axios"
import { useEffect, useState } from "react"
import { backendServer } from "../helpers"
import Review from "./Review"
import WriteReview from "./reviewForm"

interface ReviewsProps {
    attractionID: string
}
export default function Reviews(props: ReviewsProps) {
    const [Error, setError] = useState("")
    const [reviews, setReviews] = useState([])

    function getReviews() {
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
    }
    useEffect(() => {
        getReviews()
    }, [])


    return (
        <div>
            <h1>Reviews</h1>
            <WriteReview attractionID={props.attractionID}/>
            {reviews.map(review => {
                return(<Review attractionID={props.attractionID} userID={(review as any).userID} reviewText={(review as any).review} rating={(review as any).stars} date={(review as any).date}/>)
            })}
        </div>
    )

}