import './styling/addThemePark.css'
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { backendServer } from '../helpers';
import axios from 'axios';
import { loggedIn } from '../localStorageProcessing'
import { LoginFirstCard } from '../higherOrderComponents/cardWithLinkTo';
import ThemeParkInputForm from './themeParkInputForm';
import { ThemePark } from './themePark';

function AddThemePark() {
    // some constants
    const navigate = useNavigate();
    var user: Boolean = loggedIn();
    const [validated, setValidated] = useState(false);

    // check the errors 
    function checkErrors(data: any): boolean {
        if (data) {
            alert(data);
            return true;
        } else return false;
    }

    // handle the submit of theme parks
    function submit(themepark: ThemePark) {
        const handleSubmit: React.FormEventHandler<HTMLFormElement> =
            (event: React.FormEvent<HTMLFormElement>) => {
                const form = event.currentTarget;
                if (form.checkValidity() === false) {
                    event.preventDefault();
                    event.stopPropagation();
                } else {
                    axios.post(backendServer("/themepark"), themepark.toJSON()).then((response) => {
                        alert("Theme park was succesfully added")
                        if (response.data.recognised) {
                            navigate("/home")
                        }

                    }).catch(function (error) {
                        if (error.response.status === 418) {
                            alert("Address not found")
                            setValidated(false);
                        } else if (checkErrors(error.error)) {
                            setValidated(false);
                        }
                    })
                }
                event.preventDefault();
                setValidated(true);

            }
        return handleSubmit
    }

    // if user is logged in, show the form, otherwise tell them to login first
    if (user) {
        return (
            <div className="ContentOfPage">
                <h1>Add a theme park</h1>
                <ThemeParkInputForm
                    title={"Add a new theme park"}
                    text={"Fill in the form to add a new theme park. Please check first if the theme park is not a duplicate."}
                    validated={validated}
                    onFormSubmit={submit}
                />
            </div >);
    } else {
        return (
            <LoginFirstCard />
        );
    }

}
export default AddThemePark;