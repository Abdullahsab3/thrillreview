import Dropdown from 'react-bootstrap/Dropdown';
import { MouseEventHandler } from "react";
import axios from 'axios';
import { useState, useEffect, useCallback, useRef } from 'react';
import './styling/connectThemeParks.css';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { Search } from 'react-bootstrap-icons';
import Portal from 'react-overlays/Portal';

interface themeParkPreviewInfoInterface {
    id: number,
    name: string,
}

function isIdInArray(a: themeParkPreviewInfoInterface[], i: number): Boolean {
    let res = false;
    a.forEach(t => {
        if (t.id === i) res = true;
    });
    return res;
}

interface connectThemeParkInterface {
    onClick: (id: number, name: string) => MouseEventHandler<HTMLElement>;
}

function ConnectThemePark(props: connectThemeParkInterface) {
    const [themeParkItems, setThemeParkItems] = useState<themeParkPreviewInfoInterface[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [hasMore, setHasMore] = useState(false);

    const [query, setQuery] = useState("");
    const [pageNr, setPageNr] = useState(1);
    const [intermediateQuery, setIntermediateQuery] = useState("");
    const LIMIT_RETURNS = 6;
    const containerRef = useRef(null);
    useEffect(() => {
        axios.get(`/themeparks/find?query=${query}&page=${pageNr}&limit=${LIMIT_RETURNS}`).then(res => {
            let prevThemeparks: themeParkPreviewInfoInterface[] = themeParkItems;
            if (pageNr <= 1) {
                prevThemeparks = [];
            }
            res.data.result.map((park: any) => {
                const { name, id } = park
                if (!isIdInArray(prevThemeparks, id))
                    prevThemeparks.push({
                        name: name,
                        id: id,
                    });
            });
            setThemeParkItems(prevThemeparks);
            setHasMore(res.data.result.length === LIMIT_RETURNS);
            setLoading(false);
        }).catch(e => {
            setLoading(false)
            setError(true);
        })
    }, [query, pageNr]);

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

  

    function handleThemeParkSubmit(event: React.FormEvent<HTMLFormElement>) {
        setPageNr(1);
        setQuery(intermediateQuery);
        event.preventDefault()
    };


    return (
        <>
        <Dropdown autoClose="outside">
            <Dropdown.Toggle>Select theme park</Dropdown.Toggle>
            <Dropdown.Menu>
                <Dropdown.Item>
                   <div ref={containerRef}></div>
                </Dropdown.Item>
                {themeParkItems.map((t: themeParkPreviewInfoInterface, i: number) => {
                    if (themeParkItems.length === i + 1) {
                        return <Dropdown.Item key={t.id} ref={lastThemeParkRef} eventKey={t.id} onClick={props.onClick(t.id, t.name)}>{t.name}</Dropdown.Item>;
                    } else {
                        return <Dropdown.Item key={t.id} eventKey={t.id} onClick={props.onClick(t.id, t.name)}>{t.name}</Dropdown.Item>;
                    }
                })}
            </Dropdown.Menu>
        </Dropdown>
 <Portal container={containerRef}>
                        <Form onSubmit={handleThemeParkSubmit}>
                            <InputGroup>
                                <Form.Control type="search" onChange={(e) => setIntermediateQuery(e.target.value)} placeholder="Search" />
                                
                                <Button type="submit">
                                    <Search />
                                </Button>
                            </InputGroup>
                        </Form>
                    </Portal>

</>
    );

}

export default ConnectThemePark;