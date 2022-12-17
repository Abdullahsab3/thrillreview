import Axios from "axios"
import { useEffect, useState } from "react"
import { Button, Card } from "react-bootstrap"
import { backendServer } from "../helpers"
import { fetchUserFromLocalStorage } from "../localStorageProcessing"
import { userAvatarExists, getUsername, User } from "../userManagement/User"
import WriteReview from "./reviewForm"
import StarRating from "./starRating"
import "./styling/review.css"

interface ReviewProps {
    userID: number
    attractionID: number
    reviewText: string
    rating: number
    date: string
    className?: string
}
export default function Review(props: ReviewProps) {
    const [Error, setError] = useState("")
    const [username, setUsername] = useState("")
    const [avatar, setAvatar] = useState(false)
    const [postedByUser, setPostedByUser] = useState(false)
    const [editedClicked, setEditedClicked] = useState(false)

    const user: User | null = fetchUserFromLocalStorage()


    useEffect(() => {


        if (user && ((user as User).id === props.userID)) {
            setPostedByUser(true)
        }
        userAvatarExists(props.userID, function (exists: boolean) {
            if (exists) {
                setAvatar(exists)
            }
        })
        getUsername(props.userID, function (error, username) {
            if (error) {
                setError(error)
            } else if (username) {
                setUsername(username)
            }
        })
    }, [])



    return (
        <div>
            <Card className={props.className ? `comment ${props.className}` : "comment"}>
                <Card.Title>
                    <div>
                        {avatar && <img src={backendServer(`/user/${props.userID}/avatar`)} className="commentAvatar" />}
                        {username}
                        {(postedByUser && !editedClicked) &&
                            <Button variant="Link" className="edit" onClick={() => {
                                setEditedClicked(true)
                            }}>Edit</Button>}
                    </div>
                </Card.Title>
                <Card.Subtitle>{props.date}</Card.Subtitle>
                {editedClicked ?
                    <WriteReview attractionID={props.attractionID} edit /> :
                    <div>
                        <StarRating rating={props.rating} />
                        <Card.Text>
                            {props.reviewText}
                        </Card.Text>
                    </div>}

            </Card>

        </div>
    )

}