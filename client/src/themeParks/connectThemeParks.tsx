import Dropdown from 'react-bootstrap/Dropdown';
import { MouseEventHandler } from "react";
import axios from 'axios';
import { useState, useEffect, useCallback, useRef } from 'react';
import './styling/connectThemeParks.css'

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
    const [themeParkQuery, setThemeParkQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const LIMIT_RETURNS = 6;
    const [query, setQuery] = useState("");
    const [pageNr, setPageNr] = useState(1);

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

    return (
        <Dropdown>
            <Dropdown.Toggle>Select theme park</Dropdown.Toggle>
            <Dropdown.Menu>
                {themeParkItems.map((t: themeParkPreviewInfoInterface, i: number) => {
                    if (themeParkItems.length === i + 1) {
                        return <Dropdown.Item key={t.id} ref={lastThemeParkRef} eventKey={t.id} onClick={props.onClick(t.id, t.name)}>{t.name}</Dropdown.Item>;
                    } else {
                        return <Dropdown.Item key={t.id} eventKey={t.id} onClick={props.onClick(t.id, t.name)}>{t.name}</Dropdown.Item>;
                    }
                })}
            </Dropdown.Menu>
        </Dropdown>

    );

}

export default ConnectThemePark;