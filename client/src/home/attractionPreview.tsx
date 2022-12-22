import { useEffect, useState } from "react"
import { Card } from "react-bootstrap"
import { backendServer } from "../helpers"
import { userAvatarExists, getUsername } from "../userManagement/User"

interface attractionpreviewProps {
    name: string,
    attractionID: number,
    userID: number,
    themepark: string
}

export function AttractionPreview(props: attractionpreviewProps) {
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
            <a href={`/Attractions/${props.attractionID}`}>
                <Card >
                    <Card.Body>
                        <Card.Title>
                            <div>
                                {avatar ? <img src={backendServer(`/user/${props.userID}/avatar`)} className="commentAvatar" /> : <i className="bi bi-square"/> }
                                {`${userName} added a new attraction `}
                            </div>
                        </Card.Title>
                        <Card.Text className="feedstext"><b>{props.name}</b> attraction is added to <b>{props.themepark}</b> themepark</Card.Text>
                    </Card.Body>
                </Card>
            </a>

        </div>


    )


}