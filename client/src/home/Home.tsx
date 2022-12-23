import Axios from "axios";
import { useEffect, useState } from "react";
import { backendServer } from "../helpers";
import { AttractionPreview } from "./attractionPreview";
import { ReviewPreview } from "./reviewPreview";
import { ThemeparkPreview } from "./themeparkPreview";
import "./styling/feeds.css"
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import { Row, Container } from 'react-bootstrap'
import HighlightedAttraction from "../attractions/HighlightedAttraction";

const Home = () => {
    const { promiseInProgress } = usePromiseTracker()


    const [feeds, setFeeds] = useState<any[]>([])
    /**
     * Fetch the feeds from the server
     */
    useEffect(() => {
        trackPromise(
            Axios.get(backendServer("/feed")).then((res) => {
                if (res.data.feeds) {
                    setFeeds(res.data.feeds)
                }
            })
        )

    }, [])

    /**
     * 
     * @returns an array of preview cards for each fetched feeds post
     */
    function publishFeeds() {
        return feeds.map((value, i) => {
            switch (value.type) {
                case "review": {
                    return <ReviewPreview
                        review={value.review}
                        attractionID={value.attractionID}
                        userID={value.userID}
                        rating={value.rating}
                        date={value.date}
                        key={i}
                    />
                }
                case "attraction": {
                    return <AttractionPreview
                        name={value.name}
                        attractionID={value.id}
                        userID={value.userID}
                        themepark={value.themepark}
                        key={i}
                    />

                }
                case "themepark": {
                    return <ThemeparkPreview
                        name={value.name}
                        themeParkID={value.id}
                        userID={value.userID}
                        country={value.country}
                        key={i}
                    />
                }
            }
        })
    }

    return (
        <div>
            <h1 className="title"> Welcome to Thrillreview! </h1>


            <Container>
                <Row >
                    <div className="d-flex flex-column justify-content-center align-items-center" >
                        <HighlightedAttraction />
                    </div>
                </Row>
                <Row>
                    <div className="d-flex flex-column justify-content-center  align-items-center">
                        <h3 className="feedsTitle">Recents</h3>
                        {promiseInProgress ? <i>Loading the feeds</i> : publishFeeds()}
                    </div>
                </Row>
            </Container>
        </div>


    );
}

export default Home;