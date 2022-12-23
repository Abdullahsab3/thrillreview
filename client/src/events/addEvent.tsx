import React, { useState } from 'react';
import { backendServer } from '../helpers';
import axios from 'axios';
import EventInputForm from './eventInputForm';
import { Event } from './Event';
import { loggedIn } from '../localStorageProcessing'
import { LoginFirstCard } from '../higherOrderComponents/cardWithLinkTo';

function AddEvent() {
    var user: Boolean = loggedIn();
    const [validated, setValidated] = useState(false);
    function checkErrors(data: any): boolean {
        if (data) {
            alert(data);
            return true;
        } else return false;
    }

    function submit(e: Event) {
        const handleSubmit: React.FormEventHandler<HTMLFormElement> =
            (event: React.FormEvent<HTMLFormElement>) => {
                const form = event.currentTarget
                if (form.checkValidity() === false) {
                    event.preventDefault();
                    event.stopPropagation();
                } else {
                    axios.post(backendServer("/event"), e.toJSON()).then((response) => {
                        if (response.data.added) {
                            alert("Your event has successfully been added!")
                        }
                    }
                    ).catch(function (error) {
                        if (checkErrors(error.error)) {
                            setValidated(false);
                        }
                    })
                }
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
        return (<LoginFirstCard />);
    }
}
export default AddEvent;