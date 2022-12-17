import { useEffect, useState } from "react"
import { Card } from "react-bootstrap"
import { backendServer } from "../helpers"
import { getUsername, userAvatarExists } from "../userManagement/User"

interface themeParkProps {
    name: string,
    country: string,
    themeParkID: number,
    userID: number,
}

export function ThemeparkPreview(props: themeParkProps) {
    const [userName, setUsername] = useState("")
    const [avatar, setAvatar] = useState(false)

    useEffect(() => {
        getUsername(props.userID, function (error, result) {
            setUsername(result as string)
        })
        userAvatarExists(props.userID, function (exists) {
            if (exists) {
                setAvatar(exists)
            }
        })
    }, [])


    return (
        <div className="feeds">
            <a href={`/Themeparks/${props.themeParkID}`}>
                <Card >
                    <Card.Body>
                        <Card.Title>
                            <div>
                                {avatar ? <img src={backendServer(`/user/${props.userID}/avatar`)} className="commentAvatar" /> : <i className="bi bi-square"/>}
                                {`${userName} added a new themepark `}
                            </div>
                        </Card.Title>
                        <Card.Text className="feedstext"><b>{props.name}</b> themepark is added. It is located in {props.country}. Check it out!</Card.Text>

                    </Card.Body>

                </Card>
            </a>

        </div>


    )


}