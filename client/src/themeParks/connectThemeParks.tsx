import Dropdown from 'react-bootstrap/Dropdown';
import { MouseEventHandler } from "react";
import axios from 'axios';
import { useState, useEffect } from 'react';

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
    onClick: (name: string) => MouseEventHandler<HTMLElement>;
    
}

function ConnectThemePark(props: connectThemeParkInterface) {
    const [themeParkItems, setThemeParkItems] = useState<themeParkPreviewInfoInterface[]>([]);
    const [themeParkQuery, setThemeParkQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const LIMIT_RETURNS = 10;
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
    });

    return (
        <Dropdown>
            <Dropdown.Toggle>Theme park*</Dropdown.Toggle>
            <Dropdown.Menu>
                {themeParkItems.map((t) => {
                    return <Dropdown.Item eventKey={t.id} onClick={props.onClick(t.name)}>{t.name}</Dropdown.Item>;
                })}
            </Dropdown.Menu>
        </Dropdown>
    );

}

export default ConnectThemePark;