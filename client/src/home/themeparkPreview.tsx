import { useEffect, useState } from "react"
import { Card } from "react-bootstrap"
import { getAttractionName, getuserAvatar, getUsername } from "../userManagement/User"

interface themeParkProps {
    name: string,
    country: string,
    themeParkID: number,
    userID: number,
}

export function ThemeparkPreview(props: themeParkProps) {
    const [userName, setUsername] = useState("")
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
            <a href={`/Themeparks/${props.themeParkID}`}>
                <Card >
                    <Card.Body>
                        <Card.Title>
                            <div>
                                {avatar && <img src={avatar} className="commentAvatar" />}
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