import { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import { Card, ListGroup, Button, InputGroup, Form } from 'react-bootstrap';
import { Search } from 'react-bootstrap-icons';
import "../styling/browsingPage.css";
import { ThemePark } from './themePark';
import { ErrorCard, LoadingCard, NoMatchesCard } from '../higherOrderComponents/generalCardsForBrowsing';
import { backendServer } from '../helpers';

interface themeParkPreviewInterface {
    id: number,
    name: string,
    country: string,
    key: number,
    refs?: (e: HTMLDivElement) => void,
}

function ThemeParkPreviewCard(props: themeParkPreviewInterface) {
    if (props.refs) {
        return (
            <Card className="browsingCard" ref={props.refs}>
                <Card.Title>{props.name}</Card.Title>
                <ListGroup className="list-group-flush">
                    <ListGroup.Item>Country: {props.country}</ListGroup.Item>
                </ListGroup>
                <Card.Body>
                    <Link to={`/Themeparks/${props.id}`}>
                        <Button>
                            Go to themePark!
                        </Button>
                    </Link>
                </Card.Body>
            </Card>);
    } else {
        return (
            <Card className="browsingCard">
                <Card.Title>{props.name}</Card.Title>
                <ListGroup className="list-group-flush">
                    <ListGroup.Item>Country: {props.country}</ListGroup.Item>
                </ListGroup>
                <Card.Body>
                    <Link to={`/Themeparks/${props.id}`}>
                        <Button>
                            Go to themePark!
                        </Button>
                    </Link>
                </Card.Body>
            </Card>
        );
    }
}

function isIdInArray(a: ThemePark[], i: number): Boolean {
    let res = false;
    a.forEach(t => {
        if (t.id === i) res = true;
    });
    return res;
}

// took inspiration from https://www.youtube.com/watch?v=NZKUirTtxcg
function GetThemeParks(query: string, pageNr: number) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [themeparks, setThemeParks] = useState<ThemePark[]>([]);
    const LIMIT_RETURNS = 6;

    // to set themeparks to empty
    useEffect(() => {
        setThemeParks([]);
    }, [query]);
    // to load new themeparks
    useEffect(() => {
        setLoading(true)
        setError(false)
        axios.get(backendServer(`/themeparks/find?query=${query}&page=${pageNr}&limit=${LIMIT_RETURNS}`)).then(res => {
            console.log("res:", res);
            let prevThemeparks = themeparks;
            if (pageNr <= 1) {
                prevThemeparks = []
            }
            res.data.result.map((park: any) => {
                const { name, openingdate, country, street, postalcode, streetnumber, type, website, id } = park
                if (!isIdInArray(prevThemeparks, id))
                    prevThemeparks.push(new ThemePark(name, openingdate, street, streetnumber, postalcode, country, type, website, id));
            });
            setThemeParks(prevThemeparks);
            setHasMore(res.data.result.length === LIMIT_RETURNS);
            setLoading(false);
        }).catch(e => {
            setLoading(false)
            setError(true);
        })
    }, [query, pageNr]);

    return (
        { themeparks, hasMore, loading, error } //
    );
}




function BrowseThemeparks() {
    const [query, setQuery] = useState("");
    const [intermediateQuery, setIntermediateQuery] = useState("");
    const [pageNr, setPageNr] = useState(1);
    let { themeparks, hasMore, loading, error } = GetThemeParks(query, pageNr);
    const observer = useRef<IntersectionObserver | null>(null);  // zonder de null (in type en in haakjes) werkte het niet, dit werkte ook niet : useRef() as React.MutableRefObject<HTMLDivElement>; 
    const lastThemeParkRef = useCallback((node: HTMLDivElement) => {
        if (loading) return // otherwise will keep sending callbacks while loading
        // https://github.com/WebDevSimplified/React-Infinite-Scrolling/blob/master/src/App.js 
        if (observer.current) observer.current.disconnect(); // disconnect current observer to connect a new one
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) { // ref is showing on the page + there is still more   
                setPageNr(prevPageNr => prevPageNr + 1);
            }
        })
        if (node) observer.current.observe(node)
    }, [loading, hasMore])

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        setPageNr(1);
        setQuery(intermediateQuery)
        console.log("thprk", themeparks)
        event.preventDefault()
    }

    return (
        <>
            <Card className="browsingCard">
                <Card.Body>
                    <Card.Title>Search Theme Parks</Card.Title>
                    <Card.Text>Find the theme park you are looking for!</Card.Text>
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

            {themeparks.length ?
                themeparks.map((themePark: ThemePark, i: number) => {
                    if (themeparks.length === i + 1) {
                        return (
                            <ThemeParkPreviewCard refs={lastThemeParkRef} key={themePark.id} id={themePark.id} name={themePark.name} country={themePark.country} />
                        );
                    } else {
                        return (
                            <ThemeParkPreviewCard key={themePark.id} id={themePark.id} name={themePark.name} country={themePark.country} />
                        );
                    }
                }) :
                <NoMatchesCard topic={"themeparks"} topicSingular={"themepark"} />}

            {loading ? <LoadingCard topic={"themeparks"} /> : ""}
            {error ? <ErrorCard topic={"themeparks"} /> : ""}
        </>
    );

}


export default BrowseThemeparks;