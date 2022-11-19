import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card'
import Axios from 'axios'
import { User } from './User'
import { fetchUserFromLocalStorage, setUserInLocalstorage } from './localStorageProcessing'
import { Link } from 'react-router-dom';
import { backendServer } from './helpers'
import InputGroup from 'react-bootstrap/InputGroup';
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import ButtonWithLoading from './buttonWithLoading';
import "./uploadAvatar.css"

export default function UploadAvatar() {

    const { promiseInProgress } = usePromiseTracker()

    const savedUser: User | null = fetchUserFromLocalStorage();
    const [uploadedFile, setUploadedFile] = useState<File | null>()
    const [preview, setPreview] = useState("")
    const [fileError, setFileError] = useState("")


    function sendAvatar(file: File | null) {
        if (file) {
            const formData = new FormData();
            formData.append('avatar', file)
            Axios.post(backendServer("/upload-avatar"), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
        }
    }

    function setUploadedAvatar(f: File | null) {
        setUploadedFile(f);
        const objectUrl = URL.createObjectURL((f as File))
        setPreview(objectUrl)
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            setUploadedAvatar(e.target.files[0]);
        }
    };
    function dropHandler(e: any): void {
        console.log('File(s) dropped');
        e.preventDefault();
        e.stopPropagation();

        if (e.dataTransfer.items) {
            const file = [...e.dataTransfer.items][0].getAsFile()
            setUploadedAvatar(file)

        } else {
            const file = [...e.dataTransfer.files][0]
            setUploadedAvatar(file)
        }

    }

    function dragOverhandler(e: any): void {
        e.preventDefault();
        e.stopPropagation();

    }

    function isFormValid() {
        return uploadedFile;
    }





    if (savedUser) {

        return (
            <div className='col d-flex justify-content-center'>
              
                <Card className='card' border='secondary'
                    onDrop={dropHandler}
                    onDragOver={dragOverhandler}>
                    <Card.Body>
                        <Card.Title ><strong>Upload your avatar</strong></Card.Title>
                        
                        <Form.Group className="mb-3">
                            <Form.Label>Drag and drop your avatar image here or choose a file to upload</Form.Label>
                            <InputGroup hasValidation>

                                <Form.Control
                                    required
                                    type="file"
                                    id="file"
                                    onChange={handleFileChange}
                                    isInvalid={(fileError as any)} />
                                <Form.Control.Feedback type="invalid">
                                    {fileError}
                                </Form.Control.Feedback>
                            </InputGroup>
                            
                            <ButtonWithLoading disabled={!isFormValid() || promiseInProgress} promiseInProgress={promiseInProgress} message="Submit" />

                        </Form.Group>
                        {preview && <Card.Img variant="bottom" className="preview" src={preview}/>}
                    </Card.Body>
                </Card>

            </div>
        );
    } else {
        return (
            <div className='changeUsername'>
                In order to change your avatar, you have to <Link to="/Login">Log in first</Link>
            </div>
        )
    }
}