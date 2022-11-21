import Axios from "axios"
import { useEffect, useState } from "react"
import { Card } from "react-bootstrap"
import { backendServer } from "../helpers"
import { getuserAvatar, getUsername } from "../userManagement/User"
import "./styling/review.css"

interface ReviewProps {
    userID: number
    reviewText: string
    date: string
}
export default function Review(props: ReviewProps) {
    const [Error, setError] = useState("")
    const [username, setUsername] = useState("")
    const [avatar, setAvatar] = useState("")




    useEffect(() => {

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
                    {avatar && <img src={avatar} className="commentAvatar"/>}
                    {username}
                    </div>
                    </Card.Title>
                <Card.Subtitle>{props.date}</Card.Subtitle>
                <Card.Text>
                    {props.reviewText}
                </Card.Text>
            </Card>

        </div>
    )

}