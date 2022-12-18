import './styling/addThemePark.css'
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
import { loggedIn } from '../localStorageProcessing'
import CardWithLinkTo from '../higherOrderComponents/HigherOrderComponents';
import ThemeParkInputForm from './themeParkInputForm';
import { ThemePark } from './themePark';

function AddThemePark() {
    const navigate = useNavigate()

    var user: Boolean = loggedIn();


    const [validated, setValidated] = useState(false);

    function submit(themepark: ThemePark) {
        const handleSubmit : React.FormEventHandler<HTMLFormElement> = 
        (event: React.FormEvent<HTMLFormElement>) => {
            const form = event.currentTarget
            
            if (form.checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
            } else {
                axios.post(backendServer("/themepark"), {
                    name: themepark.name,
                    openingsdate: themepark.openingdate,
                    street: themepark.street,
                    streetNumber: themepark.streetNumber,
                    postalCode: themepark.postalCode,
                    country: themepark.country,
                    type: "",
                    website: themepark.website,
                }).then((response) => {
                    if (response.data.recognised) {
                        navigate("/home")
                    }
                }).catch(function (error) {
                    if (error.response.status === 418) {
                        alert("Address not found")
                    }
                })
            }
            event.preventDefault();
            setValidated(true);

        }
        return handleSubmit
    }



    // length, height, duration : zal nog gevalideerd worden dat echt cijfer is  : https://codesandbox.io/s/9zjo1lp86w?file=/src/Components/InputDecimal.jsx
    // row moet rond card want anders krijg je een lelijke gap tussen header en de card
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
            <CardWithLinkTo to='/Login' title='Please log in first.' />
        );
    }

}
export default AddThemePark;