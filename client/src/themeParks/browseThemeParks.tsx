import { useEffect, useState, useRef, useCallback, MutableRefObject } from 'react';
import axios, { Canceler, CancelTokenSource } from 'axios';
import { useParams, Link } from "react-router-dom";
import { Card, ListGroup, Button, InputGroup, Form } from 'react-bootstrap';
import { Search } from 'react-bootstrap-icons';
import "../styling/browsingPage.css";
import { ThemePark } from './themePark';

interface themeParkPreviewInterface {
    id: number,
    name: string,
    country: string,
    key: number,
    ref?: any,//(e: HTMLDivElement) => void,
}

function ThemeParkPreviewCard(props: themeParkPreviewInterface) {
    console.log("ref:",  props.ref)
    if (props.ref) {
        console.log("LAST")
        return(
        <Card className="browsingCard" ref={props.ref}>
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

// took inspiration from https://www.youtube.com/watch?v=NZKUirTtxcg
function GetThemeParks(query: string, pageNr: number) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [themeparks, setThemeParks] = useState<ThemePark[]>([]);

    // to set themeparks to empty
    useEffect(() => {
        setThemeParks([]);
    }, [query])
    // to load new themeparks
    useEffect(() => {
        setLoading(true)
        setError(false)
        //let cancel: Canceler
        axios.get(`/themeparks/find?query=${query}&page=${pageNr}&limit=${4}`).then(res => { // { cancelToken: new axios.CancelToken(c => cancel = c) }
            console.log("page:", pageNr)
            console.log("res:", res);
            const prevThemeparks = themeparks
            res.data.result.map((park: any) => {
                const { name, openingdate, country, street, postalcode, streetnumber, type, website, id } = park
                prevThemeparks.push(new ThemePark(name, openingdate, street, streetnumber, postalcode, country, type, website, id));
            });
            setThemeParks(prevThemeparks);
            console.log("res lenght", res.data.result.length);
            setHasMore(res.data.result.length > 0);
            setLoading(false);
        }).catch(e => {
            // if (axios.isCancel(e)) return // if cancelled, it was meant to
            setLoading(false)
            setError(true);
        })
        //return () => cancel();
    }, [query, pageNr]);

    return (
        { themeparks, hasMore, loading, error } //
    );
}

function LoadingCard() {
    return (
        <Card>
            <Card.Title> We are loading the themeparks, please wait</Card.Title>
            <Card.Body> In the mean time, grab some tea! </Card.Body>
        </Card>
    );
}

function ErrorCard() {
    return (
        <Card bg="danger" className="browsingCard mb-2" >
            <Card.Title> There has been a problem loading the themeparks. Please try again.</Card.Title>
            <Card.Body> Our apologies for the inconvenience. </Card.Body>
        </Card>
    );
}

function BrowseThemeparks() {
    const { initialQuery } = useParams();
    //console.log("query:", initialQuery);
    const [query, setQuery] = useState("");
    const [intermediateQuery, setIntermediateQuery] = useState("");
    const [pageNr, setPageNr] = useState(1);
    if (initialQuery) setQuery(initialQuery);
    let { themeparks, hasMore, loading, error } = GetThemeParks(query, pageNr); //
    const observer = useRef<IntersectionObserver | null>(null);  // zonder de null (in type en in haakjes) werkte het niet, dit werkte ook niet : useRef() as React.MutableRefObject<HTMLDivElement>; 
    const lastThemeParkRef = useCallback((node: HTMLDivElement) => {
        console.log("TRIGGERED");
        if (loading) return // otherwise will keep sending callbacks while loading
        console.log("node:", node);
        // https://github.com/WebDevSimplified/React-Infinite-Scrolling/blob/master/src/App.js 
        if (observer.current) observer.current.disconnect(); // disconnect current observer to connect a new one
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) { // ref is showing on the page + there is still more
                setPageNr(prevPageNr => prevPageNr + 1);
            }
        })
        if (node) observer.current.observe(node)
    }, [loading, hasMore])

    //  OM TE TESTEN ZONDER BACKEND
    //themeparks = [new ThemePark("anubis", "29/01/2003", "street", 12, "1170", "BE", "indoor", "https://myweb.be", 1)]


    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        setPageNr(1);
        setQuery(intermediateQuery)
        event.preventDefault()
    }



    //Q : zou ik iedere keer opnieuw laten linken zodat de query update in de link?
    //  <Link to={`/browse-themeparks/${query}`}>   </Link> rond submit knop
    // nadeel: elke keer via routing
    // voordeel: link wordt geupdatet
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
            {themeparks.map((themePark: ThemePark, i: number) => {
                //console.log("themeparks:", themeparks);
                //console.log("thprk:", themePark);

                console.log("id:", themePark.id)
                console.log("len:", themeparks.length )
                if (themeparks.length === i + 1) {
                    (console.log("LENGTH"))
                    // HET KAN ZIJN DAT DE REF NIET WERKT, (zie error in console log, maar is v react router dom en ref is v react, dus idk - kan niet testen want moet dan iets v backend krijgen)
                    return (
                        <ThemeParkPreviewCard ref={lastThemeParkRef} key={themePark.id} id={themePark.id} name={themePark.name} country={themePark.country} />
                    );
                } else {
                    return (
                        <ThemeParkPreviewCard key={themePark.id} id={themePark.id} name={themePark.name} country={themePark.country} />
                    );
                }
            })}
            {loading ? <LoadingCard /> : ""}
            {error ? <ErrorCard /> : ""}
        </>
    );

}


export default BrowseThemeparks;