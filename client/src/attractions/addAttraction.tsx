import './styling/addAttraction.css'
import React, { useState } from 'react';
import Axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { backendServer } from '../helpers';
import AttractionInputForm from './attractionInputForm';
import { Attraction } from './Attraction';
import { loggedIn } from '../localStorageProcessing';
import  { LoginFirstCard } from '../higherOrderComponents/cardWithLinkTo';

function AddAttraction() {
    const navigate = useNavigate()
    const [validated, setValidated] = useState(false);
    var user: Boolean = loggedIn();


    function submit(attraction: Attraction, images: File[]) {
        const handleSubmit: React.FormEventHandler<HTMLFormElement> =
            (event: React.FormEvent<HTMLFormElement>) => {
                const form = event.currentTarget
                if (form.checkValidity() === false || !attraction.themepark) {
                    event.preventDefault();
                    event.stopPropagation();
                } else {
                    Axios.post(backendServer("/attraction"), attraction.toJSON()
                    ).then((response) => {
                        alert("The attraction was successfully added!")
                        if (response.data.registered) {
                        }
                        if (images) {
                            const id = response.data.id;


                            let i: number = 0;

                            while (images[i]) {
                                const formData = new FormData();

                                formData.append(`image`, images[i]);


                                Axios.post(backendServer(`/attraction/${id}/photos`), formData, {
                                    headers: {
                                        'Content-Type': 'multipart/form-data'
                                    }
                                }).then((res) => {
                                }).catch(function (error) {
                                })
                                i++;
                            }


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
    if (user) {
        return (
            <AttractionInputForm
                title="Add an attraction"
                text="Fill in the form to add a new attraction. Please check first if the attraction is not a duplicate."
                onFormSubmit={submit}
                validated={validated} />
        );
    } else {
        return(
            <LoginFirstCard />
        );
    }
}

export default AddAttraction;