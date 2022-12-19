import { useEffect, useState } from "react"
import { Button, Card } from "react-bootstrap"
import { getAttractionName } from "../attractions/Attraction"
import Review from "../attractions/Review"
import { getUsername } from "../userManagement/User"

interface reviewPreviewProps {
    review: string,
    attractionID: number,
    userID: number,
    rating: number
    date: string

}

export function ReviewPreview(props: reviewPreviewProps) {
    const [userName, setUsername] = useState("")
    const [attractionName, setAttractionName] = useState("")

    useEffect(() => {
        getUsername(props.userID, function (error, result) {
            setUsername(result as string)
        })
        getAttractionName(props.attractionID, function (error, result) {
            setAttractionName(result as string)
        })
    }, [])


    return (
        <div className="feeds">
            <a href={`/Attractions/${props.attractionID}`}>
                <Card>
                    <Card.Body>
                        <Card.Title>{`${userName} wrote a review about ${attractionName}`}</Card.Title>
                        <Review
                            className="reviewinFeeds"
                            reviewText={props.review}
                            userID={props.userID}
                            attractionID={props.attractionID}
                            date={props.date} rating={props.rating} />
                    </Card.Body>
                </Card>
            </a>

        </div>


    )

}