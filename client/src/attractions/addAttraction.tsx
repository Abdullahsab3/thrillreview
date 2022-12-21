import './styling/addAttraction.css'
import React, { useState, useEffect } from 'react';
import Axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { backendServer } from '../helpers';
import AttractionInputForm from './attractionInputForm';
import { Attraction } from './Attraction';
import { loggedIn } from '../localStorageProcessing';
import { LoginFirstCard } from '../higherOrderComponents/cardWithLinkTo';

function AddAttraction() {
    const navigate = useNavigate()
    const [validated, setValidated] = useState(false);
    const [id, setId] = useState(-1)
    const [images, setImages] = useState<File[]>([])
    var user: Boolean = loggedIn();


    function checkErrors(data: any): boolean {
        if (data) {
            alert(data);
            return true;
        } else return false;
    }


    function submit(attraction: Attraction, images: File[]) {
        const handleSubmit: React.FormEventHandler<HTMLFormElement> =
            (event: React.FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                setImages(images)
                const form = event.currentTarget
                if (!form.checkValidity() || !attraction.themepark) {
                    event.stopPropagation();
                } else {
                    Axios.post(backendServer("/attraction"), attraction.toJSON()
                    ).then((response) => {
                        setId(response.data.id)

                    }).catch(function (error) {
                        if (checkErrors(error.error)) {
                            setValidated(false)
                        }
                    })

                }
            }
        return (handleSubmit)
    }

    useEffect(() => {
        if (id > -1) {
            const sendImages = async () => {
                Promise.all(images.map(async (image) => {
                    const formData = new FormData();

                    formData.append(`image`, image);

                    Axios.post(backendServer(`/attraction/${id}/photos`), formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })

                }))
            }

            sendImages()

            alert("The attraction was successfully added!")
            setValidated(true);
            navigate(`/Attractions/${id}`)
        }
    }, [id])
    if (user) {
        return (
            <AttractionInputForm
                title="Add an attraction"
                text="Fill in the form to add a new attraction. Please check first if the attraction is not a duplicate."
                onFormSubmit={submit}
                validated={validated} />
        );
    } else {
        return (
            <LoginFirstCard />
        );
    }
}

export default AddAttraction;