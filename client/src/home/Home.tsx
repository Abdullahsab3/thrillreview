import Axios from "axios";
import { useEffect, useState } from "react";
import { backendServer } from "../helpers";
import { AttractionPreview } from "./attractionPreview";
import { ReviewPreview } from "./reviewPreview";
import { ThemeparkPreview } from "./themeparkPreview";
import "./styling/feeds.css"

const Home = () => {
    const [feeds, setFeeds] = useState<any[]>([])
    useEffect(() => {
        Axios.get(backendServer("/feed")).then((res) => {
            if (res.data.feeds) {
                setFeeds(res.data.feeds)
            }
        })
    }, [])

    function publishFeeds() {
        return feeds.map((value) => {
            switch (value.type) {
                case "review": {
                    return <ReviewPreview
                        review={value.review}
                        attractionID={value.attractionID}
                        userID={value.userID}
                        rating={value.rating}
                        date={value.date} />
                }
                case "attraction": {
                    return <AttractionPreview
                        name={value.name}
                        attractionID={value.id}
                        userID={value.userID}
                        themepark={value.themepark} />

                }
                case "themepark": {
                    return <ThemeparkPreview
                        name={value.name}
                        themeParkID={value.id}
                        userID={value.userID}
                        country={value.country} />
                }
            }
        })
    }

    return (
        <div>
            <h1 className="title"> Welcome to Thrillreview! </h1>
            <div className="d-flex flex-column justify-content-center  align-items-center">
                <h3 className="feedsTitle">Recents</h3>

            {publishFeeds()}

            </div>

        </div>
    );
}

export default Home;