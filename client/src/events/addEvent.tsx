//import './styling/addThemePark.css'
import React, { useState } from 'react';
import { Card, Dropdown } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { backendServer } from '../helpers';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { setSyntheticTrailingComments } from 'typescript';
import axios from 'axios';
import { allowedNodeEnvironmentFlags } from 'process';
import EventInputForm from './eventInputForm';
import { Event } from './Event';
import { loggedIn } from '../localStorageProcessing'
import CardWithLinkTo from '../higherOrderComponents/HigherOrderComponents';

function AddEvent() {
    const navigate = useNavigate();
    var user: Boolean = loggedIn();

    const [validated, setValidated] = useState(false);
    function submit(e: Event) {
        const handleSubmit: React.FormEventHandler<HTMLFormElement> =
            (event: React.FormEvent<HTMLFormElement>) => {
                const form = event.currentTarget
                event.preventDefault();
                setValidated(true);
            }
        return handleSubmit;
    }
    if (user) {
        return (
            <div className="ContentOfPage">
                <h1>Add an event</h1>
                <EventInputForm title="Add Event" text="Add your really fun event!" validated={validated} onFormSubmit={submit} />
            </div >);
    } else {
        return (<CardWithLinkTo to='/Login' title='Please log in first.' />);
    }
}
export default AddEvent;