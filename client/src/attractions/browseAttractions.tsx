import { useEffect, useState, useRef, useCallback, MutableRefObject } from 'react';
import axios from 'axios';
import { getAttractionRating } from './Attraction';
import { Link } from "react-router-dom";
import { Card, ListGroup, Button, InputGroup, Form } from 'react-bootstrap';
import StarRating from "./starRating";
import { Search } from 'react-bootstrap-icons';
import "../styling/browsingPage.css";
import { ErrorCard, LoadingCard, NoMatchesCard } from '../higherOrderComponents/generalCardsForBrowsing';
import { backendServer } from '../helpers';

// information needed to make the preview card
interface attractionPreviewInterface {
    attractionInfo: AttractionPreviewInfoInterface,
    key: number,
    refs?: (e: HTMLDivElement) => void,
}

// the info for the attraction
interface AttractionPreviewInfoInterface {
    id: number,
    name: string,
    themepark: string,
    img?: string,
    starrating?: number,
}

function AttractionPreviewCard(props: attractionPreviewInterface) {
    // some constants
    const attractionProp = props.attractionInfo;
    const [rating, setRating] = useState(0);

    // get the rating 
    useEffect(() => {
        getAttractionRating(attractionProp.id, function (rating, total, error) {
            setRating(rating)
        })

    }, []);

    // last element reference
    if (props.refs) {
        return (
            <Card className="browsingCard" ref={props.refs}>
                <Card.Title>{attractionProp.name}</Card.Title>
                {attractionProp.img ? <Card.Img variant="bottom" src={attractionProp.img} alt={`picture of attraction with name ${attractionProp.name}`} /> : ""}
                <ListGroup className="list-group-flush">
                    <ListGroup.Item>Theme park: {attractionProp.themepark}</ListGroup.Item>
                    <ListGroup.Item>Rating: <StarRating rating={rating} /></ListGroup.Item>{rating}
                </ListGroup>
                <Card.Body>
                    <Link to={`/Attractions/${attractionProp.id}`}>
                        <Button>
                            Go to attraction!
                        </Button>
                    </Link>
                </Card.Body>
            </Card>
        );
    } else {
        return (
            <Card className="browsingCard">
                <Card.Title>{attractionProp.name}</Card.Title>
                {attractionProp.img ? <Card.Img variant="bottom" src={attractionProp.img} alt={`picture of attraction with name ${attractionProp.name}`} /> : ""}
                <ListGroup className="list-group-flush">
                    <ListGroup.Item>Theme park: {attractionProp.themepark}</ListGroup.Item>
                    <ListGroup.Item>Rating: <StarRating rating={rating} /></ListGroup.Item>{attractionProp.starrating}
                </ListGroup>
                <Card.Body>
                    <Link to={`/Attractions/${attractionProp.id}`}>
                        <Button>
                            Go to attraction!
                        </Button>
                    </Link>
                </Card.Body>
            </Card>
        );
    }
}

// check whether the id is in the array
function isIdInArray(a: AttractionPreviewInfoInterface[], i: number): Boolean {
    let res = false;
    a.forEach(t => {
        if (t.id === i) res = true;
    });
    return res;
}

// took inspiration from https://www.youtube.com/watch?v=NZKUirTtxcg
function GetAttractions(query: string, pageNr: number) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [attractions, setAttractions] = useState<AttractionPreviewInfoInterface[]>([]);
    const LIMIT_RETURNS = 6;

    // to set attractions to empty
    useEffect(() => {
        setAttractions([]);
    }, [query]);
    // to load new attractions
    useEffect(() => {
        setLoading(true)
        setError(false)
        axios.get(backendServer(`/attractions/find?query=${query}&page=${pageNr}&limit=${LIMIT_RETURNS}`)).then(res => {
            let prevAttractions = attractions;
            if ((pageNr <= 1)) {
                prevAttractions = [];
            }
            res.data.result.map((attr: any, i: number) => {
                const { name, themepark, id } = attr

                if (!isIdInArray(prevAttractions, id)) {
                    const attrInfo = {
                        id: id,
                        name: name,
                        themepark: themepark,
                    }
                    prevAttractions.push(attrInfo);
                }
                setAttractions(prevAttractions);
            });
            setHasMore(res.data.result.length === LIMIT_RETURNS);
            setLoading(false);
        }).catch(e => {
            setLoading(false)
            setError(true);
        })
    }, [query, pageNr]);

    return (
        { attractions, hasMore, loading, error }
    );
}

function BrowseAttractions() {
    const [query, setQuery] = useState("")
    const [intermediateQuery, setIntermediateQuery] = useState("")
    const [pageNr, setPageNr] = useState(1);
    let { attractions, hasMore, loading, error } = GetAttractions(query, pageNr);

    // last element reference
    const observer = useRef<IntersectionObserver | null>(null);
    const lastAttractionRef = useCallback((node: HTMLDivElement) => {
        if (loading) return; // otherwise will keep sending callbacks while loading
        // https://github.com/WebDevSimplified/React-Infinite-Scrolling/blob/master/src/App.js 
        if (observer.current) observer.current.disconnect(); // disconnect current observer to connect a new one
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) { // ref is showing on the page + there is still more
                setPageNr(prevPageNr => prevPageNr + 1)
            }
        })

        if (node) observer.current.observe(node)
    }, [loading, hasMore])

    // handle submit of attraction
    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        setPageNr(1);
        setQuery(intermediateQuery);
        event.preventDefault();
    }

    // if loading/error : show those cards, otherwise, show the attraction previews, always show browsing cards
    return (
        <>
            <Card className="browsingCard">
                <Card.Body>
                    <Card.Title>Search Attractions</Card.Title>
                    <Card.Text> Find the attraction you are looking for! </Card.Text>
                    <Form onSubmit={handleSubmit}>
                        <InputGroup>
                            <Form.Control type="search" onChange={(e) => setIntermediateQuery(e.target.value)} placeholder="Search" />
                            <Button type="submit">
                                <Search />
                            </Button>
                        </InputGroup>
                    </Form>

                </Card.Body>
            </Card>

            {attractions.length ?
                attractions.map((attraction: AttractionPreviewInfoInterface, i: number) => {
                    if (attractions.length === i + 1) {
                        return (
                            <AttractionPreviewCard refs={lastAttractionRef} key={attraction.id} attractionInfo={attraction} />
                        );
                    } else {
                        return (
                            <AttractionPreviewCard key={attraction.id} attractionInfo={attraction} />
                        );
                    }
                }) : <NoMatchesCard topic={"attractions"} topicSingular={"attraction"} />}
            {loading ? <LoadingCard topic={"attractions"} /> : ""}
            {error ? <ErrorCard topic={"attractions"} /> : ""}

        </>
    );

}


export default BrowseAttractions;