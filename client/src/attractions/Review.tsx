import Axios from "axios"
import { useEffect, useState } from "react"
import { backendServer } from "../helpers"
import { getuserAvatar, getUsername } from "../userManagement/User"

interface ReviewProps {
    userID: number
    reviewText: string
    date: string
}
export default function Reviews(props: ReviewProps) {
    const [Error, setError] = useState("")
    const [username, setUsername] = useState("")
    const [avatar, setAvatar] = useState("")




    useEffect(() => {

        getuserAvatar(props.userID, function (avatar) {
            setAvatar(avatar)
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

        </div>
    )

}