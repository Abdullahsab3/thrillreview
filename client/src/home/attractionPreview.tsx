import { useEffect, useState } from "react"
import { Card } from "react-bootstrap"
import { getAttractionName, getuserAvatar, getUsername } from "../userManagement/User"

interface attractionpreviewProps {
    name: string,
    attractionID: number,
    userID: number,
    themepark: string
}

export function AttractionPreview(props: attractionpreviewProps) {
    const [userName, setUsername] = useState("")
    const [attractionName, setAttractionName] = useState("")
    const [avatar, setAvatar] = useState("")

    useEffect(() => {
        getUsername(props.userID, function (error, result) {
            setUsername(result as string)
        })
        getuserAvatar(props.userID, function (error, avatar) {
            if (avatar) {
                setAvatar(avatar as string)
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
                                {avatar && <img src={avatar} className="commentAvatar" />}
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