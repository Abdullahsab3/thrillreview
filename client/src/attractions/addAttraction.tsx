import './styling/addAttraction.css'
import React, { useState } from 'react';
import { Card, CarouselItem, Dropdown, ModalBody } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { backendServer } from '../helpers';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Carousel from 'react-bootstrap/Carousel';
import Modal from 'react-bootstrap/Modal';
import { Grid } from 'react-bootstrap-icons';
import CardWithImageUpload from '../higherOrderComponents/cardWithImageUpload';
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import AttractionInputForm from './attractionInputForm';
import { Attraction } from './Attraction';

function AddAttraction() {
    const navigate = useNavigate()
    const [validated, setValidated] = useState(false);

    function submit(attraction: Attraction) {
        const handleSubmit: React.FormEventHandler<HTMLFormElement> =
            (event: React.FormEvent<HTMLFormElement>) => {
                const form = event.currentTarget
                if (form.checkValidity() === false) {
                    event.preventDefault();
                    event.stopPropagation();
                } else {
                    Axios.post(backendServer("/attraction"), attraction.toJSON()
                    ).then((response) => {
                        if (response.data.registered) {
                            navigate("/home")
                        }
                    }).catch(function (error) {
                        if (error.response) {
                            //setError(error.response.data.error)
                        }
                    })
                }
                setValidated(true);
            }
        return (handleSubmit)

    }

    return (
        <AttractionInputForm
            title="Add an attraction"
            text="Fill in the form to add a new attraction. Please check first if the attraction is not a duplicate."
            onFormSubmit={submit}
            validated={validated} />
    );
}

export default AddAttraction;