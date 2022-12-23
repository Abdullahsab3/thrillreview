import React, { SetStateAction, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import InputGroup from 'react-bootstrap/InputGroup';
import ButtonWithLoading from './buttonWithLoading';
import "./styling/cardWithImageUpload.css"
import { Alert, Button } from 'react-bootstrap';

/* 
Supported functionalities:
    - This card allows you to upload an image by dragging and dropping it
    - This card does all the form validation for you
    - you can specify the max size of the image and the dimensions 
*/
interface cardProps {
    title: string;
    description: string;
    onSubmit: (uploadedFile: File, getFileError: (error: string) => void) => React.FormEventHandler<HTMLFormElement>;

    serverValidated: boolean;
    imageMaxSize: number;
    imageWidth?: number;
    imageHeight?: number;
    imageMaxWidth?: number;
    imageMaxHeight?: number;
    promiseInProgress: boolean;
}
/**
 * A card which allows for uploading an image, either by selecting it from the files
 * or by dragging and dropping it.
 * @param cardProps 
 * title: the title of the card
 * 
 * description: the description of the card
 * 
 * onSubmit: a function which has in its argument the uploaded file, along with a call back for possible errors
 * 
 * serverValidated: whether the server had any errors while uploading the image to it
 * 
 */

function CardWithImageUpload(cardProps: cardProps) {


    const [uploadedFile, setUploadedFile] = useState<File | null>()
    const [preview, setPreview] = useState("")
    const [fileError, setFileError] = useState("")


    /**
     * Check whether the uplaoded file is an image.
     */
    var acceptedTypes: Array<string> = ['image/png', 'image/jpg', 'image/jpeg']
    function checkImageType(f: File | null, getErr: (error: string | null) => void) {
        if (!(f && acceptedTypes.includes(f.type))) {
            getErr("File should be a png, jpg or jpeg")
        } else {
            getErr(null)
        }
    }
/**
 * Check whether the size of the image is smaller than the maximal constraint.
 * @param f 
 * @param getErr 
 */
    function checkImageSize(f: File | null, getErr: (error: string | null) => void) {
        if (f && (f.size > cardProps.imageMaxSize)) {
            getErr("File size should not exceed 8 megabytes.")
        } else {
            getErr(null)
        }
    }

    /**
     * Check whether the image dimensions are within the defined range of dimensions in the prop.
     */
    const exactDimError: string = `Images should have dimensions of ${cardProps.imageHeight} x ${cardProps.imageWidth}`
    const maxDimError: string = `images should have dimensions less than or equal to ${cardProps.imageMaxHeight} x ${cardProps.imageMaxWidth}`
    function checkImageDimensions(url: string, getErr: (error: string | null) => void) {
        const img = new Image();
        img.src = url;
        img.onload = function () {
            var height = img.height;
            var width = img.width;
            if (cardProps.imageHeight && cardProps.imageWidth) {
                if (!((height === cardProps.imageHeight) && (width == cardProps.imageWidth))) {
                    getErr(exactDimError)
                } else {
                    getErr(null)
                }
            } else if (cardProps.imageMaxHeight && cardProps.imageMaxWidth) {
                if (!((height <= cardProps.imageMaxHeight) && (width == cardProps.imageMaxWidth))) {
                    getErr(maxDimError)
                } else {
                    getErr(null)
                }
            } else {
                getErr(null)
            }
        }
    }

    /**
     * Check all the previous constraints
     * 
     * These constraints are:
     * 
     * -  the type of image (jpg, jpeg or png)
     * - the size of the image
     * - the dimensions of the image
     * 
     */
    function checkAvatarProperties(f: File | null, url: string, cb: (error: string | null) => void) {
        checkImageType(f, (error: string | null) => {
            if (error) {
                cb(error)
            } else {
                checkImageSize(f, (error: string | null) => {
                    if (error) {
                        cb(error)
                    } else {
                        checkImageDimensions(url, (dimError: string | null) => {
                            if (dimError) {
                                cb(dimError)
                            } else {
                                cb(null)
                            }
                        })
                    }
                })
            }
        })
    }

    /**
     * Once the avatar is uploaded, show a preview
     * and add the file to the state.
     */
    function setUploadedAvatar(f: File | null) {
        const objectUrl = URL.createObjectURL((f as File))
        checkAvatarProperties(f, objectUrl, (error: string | null) => {
            if (error) {
                setFileError(error)
            } else {
                setUploadedFile(f);
                setPreview(objectUrl);
            }
        })
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            setUploadedAvatar(e.target.files[0]);
        }
    };

    /**
     * When the file is dropped, "catch" it.
     * Only one file is allowed
     * so dropping multiple file will select the first file.
     */
    function dropHandler(e: any): void {
        e.preventDefault();
        e.stopPropagation();
        if (!uploadedFile) {
            if (e.dataTransfer.items) {
                const file = [...e.dataTransfer.items][0].getAsFile()
                setUploadedAvatar(file)
            } else {
                const file = [...e.dataTransfer.files][0]
                setUploadedAvatar(file)
            }
        }
    }

    function dragOverhandler(e: any): void {
        e.preventDefault();
        e.stopPropagation();
    }

    function isFormValid() {
        return uploadedFile;
    }


    /**
     * If the user clicked the "remove" button, after the file being uploaded.
     */
    function removeRetrievedAvatar() {
        setUploadedFile(null)
        setPreview("")
        setFileError("")
    }

    return (

        <Card className='userManagementCard' border='secondary'
            onDrop={dropHandler}
            onDragOver={dragOverhandler}>
            <Card.Body>
                <Card.Title ><strong>{cardProps.title}</strong></Card.Title>
                <Form validated={cardProps.serverValidated} onSubmit={cardProps.onSubmit((uploadedFile as File), function (error: string) {
                    if (error) {
                        setFileError(error)
                    }
                })}>
                    <Form.Group className="mb-3">
                        {!uploadedFile &&
                            <div>
                                <Form.Label>{cardProps.description}</Form.Label>

                                <InputGroup hasValidation>
                                    <Form.Control
                                        required
                                        type="file"
                                        accept=".jpg, .jpeg, .png"
                                        onChange={handleFileChange}
                                        isInvalid={(fileError as any)} />
                                </InputGroup>
                            </div>}

                        <ButtonWithLoading disabled={!isFormValid() || cardProps.promiseInProgress} promiseInProgress={cardProps.promiseInProgress} message="Submit" />

                        {uploadedFile &&
                            <Button id="removeButton"
                                className="submitbutton"
                                variant="danger"
                                disabled={!isFormValid()}
                                onClick={() => removeRetrievedAvatar()}>Remove image</Button>}

                    </Form.Group>
                    {fileError && <Alert key='warning' variant='warning'>{fileError}</Alert>}
                </Form>
                <div className='container-fluid '>
                    {uploadedFile && <Form.Label className="row center">Selected file: {uploadedFile?.name}</Form.Label>}
                    {preview && <Card.Img variant="row bottom" className="preview" src={preview} />}

                </div>

            </Card.Body>
        </Card>
    );
}

export default CardWithImageUpload;