import { useEffect, useState, useRef, useCallback, MutableRefObject } from 'react';
import axios, { Canceler, CancelTokenSource } from 'axios';
import { Attraction } from './Attraction';
import { useParams, Link } from "react-router-dom";
import { Card, ListGroup, Button, InputGroup, Form } from 'react-bootstrap';
import StarRating from "./starRating";
import { Search } from 'react-bootstrap-icons';
import "../styling/browsingPage.css"


interface attractionPreviewInterface {
    id: number,
    name: string,
    themepark: string,
    img: string,
    starrating: number,
    key:number,
    ref?: (e: HTMLDivElement) => void,
}

function AttractionPreviewCard(props: attractionPreviewInterface) {
    return (
        <Card className="browsingCard">
            <Card.Title>{props.name}</Card.Title>
            <Card.Img variant="bottom" src={props.img} alt={`picture of attraction with name ${props.name}`} />
            <ListGroup className="list-group-flush">
                <ListGroup.Item>Theme park: {props.themepark}</ListGroup.Item>
                <ListGroup.Item>Rating: <StarRating rating={props.starrating} /></ListGroup.Item>
            </ListGroup>
            <Card.Body>
                <Link to={`/Attractions/${props.id}`}>
                    <Button>
                        Go to attraction!
                    </Button>
                </Link>
            </Card.Body>
        </Card>
    );
}

// took inspiration from https://www.youtube.com/watch?v=NZKUirTtxcg
function GetAttractions(query: string, pageNr: number) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [attractions, setAttractions] = useState<Attraction[]>([]);

    // to set attractions to empty
    useEffect(() => {
        setAttractions([]);
    }, [query])
    // to load new attractions
    useEffect(() => {
        setLoading(true)
        setError(false)
        let cancel: Canceler
        axios({
            method: 'get',
            url: "HIER MOET DE URL KOMEN - BACKEND",
            params: { query: query, pagenr: pageNr },
            cancelToken: new axios.CancelToken(c => cancel = c)
        }).then(res => {
            setAttractions(prevAttractions => {
                return [...prevAttractions, ...res.data.attractions.map((a: any) => { // Attraction evt andere naam (afh v response) + DIE ANY MOET IETS ANDERS ZIJN, WSS JSON, Q AAN SERVER
                    const { name, themepark, openingdate, builder, type, height, length, inversions, duration, id } = a
                    new Attraction(name, themepark, openingdate, builder, type, height, length, inversions, duration, id)
                })]
            })
            setHasMore(res.data.docs.lenght > 0);
            setLoading(false)
            console.log(res.data);
        }).catch(e => {
            if (axios.isCancel(e)) return // if cancelled, it was meant to
            setLoading(false)
            setError(true);
        })
        return () => cancel();
    }, [query, pageNr]);

    return (
        { attractions, hasMore, loading, error }
    );
}

function BrowseAttractions() {
    const { initialQuery } = useParams()
    console.log(initialQuery)
    const [query, setQuery] = useState("")
    const [intermediateQuery, setIntermediateQuery] = useState("")
    const [pageNr, setPageNr] = useState(1);
    if (initialQuery) setQuery(initialQuery)
    let { attractions, hasMore, loading, error } = GetAttractions(query, pageNr);
    // HIER EEN PROBLEEM HEB AL VEEL GEKEKEN MAAR VIND HET NIET
    const observer = useRef<IntersectionObserver | null>(null);  // zonder de null (in type en in haakjes) werkte het niet, dit werkte ook niet : useRef() as React.MutableRefObject<HTMLDivElement>; 
    const lastAttractionRef = useCallback((node: HTMLDivElement) => {
        if (loading) return // otherwise will keep sending callbacks while loading
        console.log(node)
        // DIT HIER GEEFT MIJ FOUTEN, MAAR IS WAT JE MOET DOEN MET SERVER ANTW DUS KAN HET NOG NIET DOEN
        // https://github.com/WebDevSimplified/React-Infinite-Scrolling/blob/master/src/App.js 
            if (observer.current) observer.current.disconnect(); // disconnect current observer to connect a new one
          observer.current = new IntersectionObserver(entries => {
              if (entries[0].isIntersecting && hasMore) { // ref is showing on the page + there is still more
                  setPageNr(prevPageNr => prevPageNr + 1)
              }
          })
          if (node) observer.current.observe(node) 
    }, [loading, hasMore])

    //  OM TE TESTEN ZONDER BACKEND
    attractions = [new Attraction("anubis", "plopsa", "29/01/2003", "someone", "sth", "18.5", "13.5", "5", "99:59:59", 1)]

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        setPageNr(1);
        setQuery(intermediateQuery)
        event.preventDefault()
    }

    function LoadingCard() {
        return(
            <Card>
                <Card.Title> We are loading the attractions, please wait</Card.Title>
                <Card.Body> In the mean time, grab some tea! </Card.Body>
            </Card>
        );
    }

    function ErrorCard(){
        return(
            <Card bg="danger" className="browsingCard mb-2" >
            <Card.Title> There has been a problem loading the attractions. Please try again.</Card.Title>
            <Card.Body> Our apologies for the inconvenience. </Card.Body>
        </Card>
        );
    }

    //Q : zou ik iedere keer opnieuw laten linken zodat de query update in de link?
    //  <Link to={`/browse-attractions/${query}`}>   </Link> rond submit knop
    // nadeel: elke keer via routing
    // voordeel: link wordt geupdatet
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

            {attractions.map((attraction: Attraction, i: number) => {
                if (attractions.length === i + 1) {
                    // HET KAN ZIJN DAT DE REF NIET WERKT, (zie error in console log, maar is v react router dom en ref is v react, dus idk - kan niet testen want moet dan iets v backend krijgen)
                    return (
                        <AttractionPreviewCard ref={lastAttractionRef} key={attraction.id} id={attraction.id} name={attraction.name} themepark={attraction.themepark} img="https://unsplash.com/photos/C4sxVxcXEQg" starrating={3} />
                    );
                } else {
                    return(
                        <AttractionPreviewCard key={attraction.id} id={attraction.id} name={attraction.name} themepark={attraction.themepark} img="https://unsplash.com/photos/C4sxVxcXEQg" starrating={3} />
                    );
                }
            })}
            {loading ? <LoadingCard /> : ""}
            {error ? <ErrorCard /> : ""}
           
        </>
    );

}


export default BrowseAttractions;