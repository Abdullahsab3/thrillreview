import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Axios from 'axios'
import { User } from './User'
import { fetchUserFromLocalStorage } from '../localStorageProcessing'
import { Link, useNavigate } from 'react-router-dom';
import { isValidEmail, backendServer } from '../helpers';
import InputGroup from 'react-bootstrap/InputGroup';
import ButtonWithLoading from '../higherOrderComponents/buttonWithLoading';
import { usePromiseTracker, trackPromise } from "react-promise-tracker";


export default function ChangeEmail() {
    const navigate = useNavigate()

    const savedUser: User | null = fetchUserFromLocalStorage();
    const [newEmail, setNewEmail] = useState("")
    const [emailError, setEmailError] = useState("")
    const [validated, setValidated] = useState(false);


    const { promiseInProgress } = usePromiseTracker()

    function checkForErrors(data: any): boolean {
        const receievedEmailError: string = data.email
        if (receievedEmailError) {
            setEmailError(receievedEmailError)
            return true;
        } else if (data.error) {
            setEmailError(data.error)
            return true;
        } else {
            return false;
        }
    }

    const handleChangeEmail: React.FormEventHandler<HTMLFormElement> =
        (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            setEmailError("")
            event.preventDefault();
            event.stopPropagation();
            trackPromise(
                Axios.put(backendServer("/user/email"), {
                    newEmail: newEmail
                }).then((res) => {
                    if ((res as any).data.updated) {

                        setValidated(true)
                        navigate("/profile")
                    } else {

                        setValidated(false)
                    }
                }).catch(function (error) {
                    if (checkForErrors(error.response.data)) {
                        setValidated(false)
                    }
                })
            )
        };


    function isFormValid(): boolean {
        return newEmail !== "" && isValidEmail(newEmail);
    }

    if (savedUser) {

        return (
            <div className='col d-flex justify-content-center'>
                <Card className='card'>
                    <Card.Body>
                        <Card.Title><strong>Change your email</strong></Card.Title>
                        <Form noValidate validated={validated} onSubmit={handleChangeEmail}>
                            <Form.Group className="mb-3">
                                <Form.Label>New Email</Form.Label>
                                <InputGroup hasValidation>
                                    <Form.Control
                                        required
                                        type="email"
                                        onChange={(e) => setNewEmail(e.target.value)}
                                        placeholder="Enter your new email"
                                        isInvalid={(emailError as any)} />
                                    <Form.Control.Feedback type="invalid">
                                        {emailError}
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <ButtonWithLoading disabled={!isFormValid() || promiseInProgress} promiseInProgress={promiseInProgress} message="Submit your email!" />
                            </Form.Group>

                        </Form>
                    </Card.Body>

                </Card>
            </div>
        );
    } else {
        return (
            <div className='changeEmail'>
                In order to change your email, you have to <Link to="/Login">Log in first</Link>
            </div>
        )
    }
}