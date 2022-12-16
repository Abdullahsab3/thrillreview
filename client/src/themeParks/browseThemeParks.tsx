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
    refs?: (e: HTMLDivElement) => void,
}

function ThemeParkPreviewCard(props: themeParkPreviewInterface) {
    if (props.refs) {
       // console.log("ref:", props.refs)
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

function isIdInArray(a: ThemePark[], i:number): Boolean {
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

    /** Q: waarom wordt die map 2x opgeropen?  */

    // to set themeparks to empty
    useEffect(() => {
        console.log("test")
        setThemeParks([]);
       /* console.log("wait")
        console.log("wait")
        console.log("wait")
        console.log("wait") */
        console.log(themeparks)
    }, [query])
    // to load new themeparks
    useEffect(() => {
        setLoading(true)
        setError(false)
       // console.log("query:", query);
        //console.log("pnr:", pageNr);
        //let cancel: Canceled
        axios.get(`/themeparks/find?query=${query}&page=${pageNr}&limit=${LIMIT_RETURNS}`).then(res => { // { cancelToken: new axios.CancelToken(c => cancel = c) }
            //console.log("page:", pageNr)
            console.log("res:", res);
            /*const newThemeParks =  res.data.result.map((park: any) => {
                const { name, openingdate, country, street, postalcode, streetnumber, type, website, id } = park
                return new ThemePark(name, openingdate, street, streetnumber, postalcode, country, type, website, id);
            }); */
            let prevThemeparks = themeparks;
            /*setThemeParks((prev) => {
                return [...new Set([...prev, ...newThemeParks])];
            })
            console.log(themeparks)*/
            res.data.result.map((park: any) => {
                const { name, openingdate, country, street, postalcode, streetnumber, type, website, id } = park
                if (!isIdInArray(prevThemeparks, id))
                prevThemeparks.push(new ThemePark(name, openingdate, street, streetnumber, postalcode, country, type, website, id));
            });
            setThemeParks(prevThemeparks);
           // console.log("res lenght", res.data.result.length);
            //setHasMore(res.data.result.length > 0);
            setHasMore(res.data.result.length === LIMIT_RETURNS)
            //console.log("has more", hasMore, res.data.result.length > 0)
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
    //const { initialQuery } = useParams();
    //console.log("query:", initialQuery);
    const [query, setQuery] = useState("");
    const [intermediateQuery, setIntermediateQuery] = useState("");
    const [pageNr, setPageNr] = useState(1);
    //if (initialQuery) setQuery(initialQuery);
    let { themeparks, hasMore, loading, error } = GetThemeParks(query, pageNr); //
    const observer = useRef<IntersectionObserver | null>(null);  // zonder de null (in type en in haakjes) werkte het niet, dit werkte ook niet : useRef() as React.MutableRefObject<HTMLDivElement>; 
    const lastThemeParkRef = useCallback((node: HTMLDivElement) => {
       // console.log("REF")
        if (loading) return // otherwise will keep sending callbacks while loading
        // https://github.com/WebDevSimplified/React-Infinite-Scrolling/blob/master/src/App.js 
        if (observer.current) observer.current.disconnect(); // disconnect current observer to connect a new one
        observer.current = new IntersectionObserver(entries => { 
          //  console.log("HAS MORE HERE", hasMore)
            if (entries[0].isIntersecting && hasMore) { // ref is showing on the page + there is still more
               
                setPageNr(prevPageNr => prevPageNr + 1);
               // console.log("p:", pageNr);
            }
        })
        if (node) observer.current.observe(node)
    }, [loading, hasMore])

    //  OM TE TESTEN ZONDER BACKEND
    //themeparks = [new ThemePark("anubis", "29/01/2003", "street", 12, "1170", "BE", "indoor", "https://myweb.be", 1)]


    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
       // console.log("HANDLE SUBMIT")
        setPageNr(1);
        setQuery(intermediateQuery)
        console.log("thprk", themeparks)
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
            <div>
            {themeparks.map((themePark: ThemePark, i: number) => {
              //  console.log("maken", i)
                //console.log("themeparks:", themeparks);
                //console.log("thprk:", themePark);
                //console.log("id:", themePark.id)
                //console.log("len:", themeparks.length)
                if (themeparks.length === i + 1) {
                    // HET KAN ZIJN DAT DE REF NIET WERKT, (zie error in console log, maar is v react router dom en ref is v react, dus idk - kan niet testen want moet dan iets v backend krijgen)
                    return (
                        <ThemeParkPreviewCard refs={lastThemeParkRef} key={themePark.id} id={themePark.id} name={themePark.name} country={themePark.country} />
                    );
                } else {
                    return (
                        <ThemeParkPreviewCard key={themePark.id} id={themePark.id} name={themePark.name} country={themePark.country} />
                    );
                }
            })}
            </div>
            {loading ? <LoadingCard /> : ""}
            {error ? <ErrorCard /> : ""}
        </>
    );

}


export default BrowseThemeparks;