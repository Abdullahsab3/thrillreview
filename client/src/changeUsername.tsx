import { useState } from 'react';
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

export default function ChangeUsername() {
    const { promiseInProgress } = usePromiseTracker()

    const savedUser: User | null = fetchUserFromLocalStorage();
    const [newUsername, setNewUsername] = useState("")
    const [newUsernameError, setNewUsernameError] = useState("")
    const [validated, setValidated] = useState(false)

    function checkForErrors(data: any): boolean {
        console.log(data)
        if (data.error) {
            const receviedNewUsernameError: string = data.username
            if (receviedNewUsernameError) {
                setNewUsernameError(receviedNewUsernameError)
            }
            return true;
        } else {
            return false;
        }
    }

    const handleChangeUsernameSubmit: React.FormEventHandler<HTMLFormElement> =
        (event: React.FormEvent<HTMLFormElement>) => {
            setNewUsernameError("");
            event.preventDefault();
            event.stopPropagation();
            trackPromise(
            Axios.post(backendServer("/updateUsername"), {
                username: newUsername
            }).then((res) => {
                if (checkForErrors((res as any).data)) {
                    setValidated(false)
                } else {
                    (savedUser as User).username = newUsername
                    setUserInLocalstorage(savedUser as User);
                    setValidated(true)
                    // lelijke tijdelijke oplossing
                    window.location.replace("/")
                }
            }).catch(function (error) {
                if (checkForErrors(error.response.data)) {
                    setValidated(false)
                }
            })
            )
        };


    function isFormValid(): boolean {
        return newUsername !== "";
    }

    if (savedUser) {

        return (
            <div className='col d-flex justify-content-center'>
                <Card className='card'>
                    <Card.Body>
                        <Card.Title><strong>Change your username</strong></Card.Title>
                        <Form noValidate validated={validated} onSubmit={handleChangeUsernameSubmit}>

                            <Form.Group className="mb-3">
                                <Form.Label>New username</Form.Label>
                                <InputGroup hasValidation>
                                    <Form.Control
                                        required
                                        type="text"
                                        onChange={(e) => setNewUsername(e.target.value)}
                                        placeholder="Enter your new username"
                                        isInvalid={(newUsernameError as any)} />
                                    <Form.Control.Feedback type="invalid">
                                        {newUsernameError}
                                    </Form.Control.Feedback>
                                </InputGroup>
                                <ButtonWithLoading disabled={!isFormValid() || promiseInProgress} promiseInProgress={promiseInProgress} message="Submit your username!"/>
                            </Form.Group>
                        </Form>
                    </Card.Body>

                </Card>
            </div>
        );
    } else {
        return (
            <div className='changeUsername'>
                In order to change your username, you have to <Link to="/Login">Log in first</Link>
            </div>
        )
    }
}