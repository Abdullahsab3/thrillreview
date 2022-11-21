import Axios from "axios"
import { useEffect, useState } from "react"
import { Button, Card } from "react-bootstrap"
import { backendServer } from "../helpers"
import { fetchUserFromLocalStorage } from "../localStorageProcessing"
import { getuserAvatar, getUsername, User } from "../userManagement/User"
import WriteReview from "./reviewForm"
import "./styling/review.css"

interface ReviewProps {
    userID: number
    attractionID: string
    reviewText: string
    date: string
}
export default function Review(props: ReviewProps) {
    const [Error, setError] = useState("")
    const [username, setUsername] = useState("")
    const [avatar, setAvatar] = useState("")
    const [postedByUser, setPostedByUser] = useState(false)
    const [editedClicked, setEditedClicked] = useState(false)

    const user: User | null = fetchUserFromLocalStorage()




    useEffect(() => {

        if ((user as User).id === props.userID) {
            setPostedByUser(true)
        }
        getuserAvatar(props.userID, function (avatar) {
            setAvatar(avatar)
        })
        getUsername(props.userID, function (error, username) {
            if (error) {
                console.log(error)
                setError(error)
            } else if (username) {
                console.log(username)
                setUsername(username)
            }
        })
    }, [])



    return (
        <div>
            <Card className="comment">
                <Card.Title>
                    <div>
                        {avatar && <img src={avatar} className="commentAvatar" />}
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
                    <Card.Text>
                        {props.reviewText}
                    </Card.Text>}
            </Card>

        </div>
    )

}