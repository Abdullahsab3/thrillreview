import { useEffect, useState, useRef, useCallback, MutableRefObject } from 'react';
import axios, { Canceler, CancelTokenSource } from 'axios';
import { Attraction } from './Attraction';
import { useParams, Link } from "react-router-dom";
import { Card, ListGroup, Button, InputGroup, Form } from 'react-bootstrap';
import StarRating from "./starRating";
import { Search } from 'react-bootstrap-icons';


interface attractionPreviewInterface {
    id: number,
    name: string,
    themepark: string,
    img: string,
    starrating: number

}

function AttractionPreviewCard(props: attractionPreviewInterface) {
    return (
        <Card>
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
    const observer = useRef<HTMLDivElement | null>(null);  // zonder de null (in type en in haakjes) werkte het niet, dit werkte ook niet : useRef() as React.MutableRefObject<HTMLDivElement>; 
    const lastAttractionRef = useCallback((node: HTMLDivElement) => {
        if (loading) return // otherwise will keep sending callbacks while loading
        console.log(node)
        // DIT HIER GEEFT MIJ FOUTEN, MAAR IS WAT JE MOET DOEN MET SERVER ANTW DUS KAN HET NOG NIET DOEN
        // https://github.com/WebDevSimplified/React-Infinite-Scrolling/blob/master/src/App.js 
        /*  if (observer.current) observer.current.disconnect(); // disconnect current observer to connect a new one
          observer.current = new IntersectionObserver(entries => {
              if (entries[0].isIntersecting && hasMore) { // ref is showing on the page + there is still more
                  setPageNr(prevPageNr => prevPageNr + 1)
              }
          })
          if (node) observer.current.observe(node) */
    }, [loading, hasMore])

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        setPageNr(1);
        setQuery(intermediateQuery)
        event.preventDefault()
    }

    //Q : zou ik iedere keer opnieuw laten linken zodat de query update in de link?
    //  <Link to={`/browse-attractions/${query}`}>   </Link> rond submit knop
    // nadeel: elke keer via routing
    // voordeel: link wordt geupdatet
    return (
        <>
            <Card>
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
                    return (<div ref={lastAttractionRef} key={attraction.id}>
                        <AttractionPreviewCard id={attraction.id} name={attraction.name} themepark={attraction.themepark} img="https://unsplash.com/photos/C4sxVxcXEQg" starrating={3} />
                    </div>);
                } else {
                    return <div key={attraction.id}>
                        <AttractionPreviewCard id={attraction.id} name={attraction.name} themepark={attraction.themepark} img="https://unsplash.com/photos/C4sxVxcXEQg" starrating={3} />
                    </div>
                }
            })}
            <div>{loading && "Loading"}</div>
            <div>{error && "error"}</div>
        </>
    );

}


export default BrowseAttractions;