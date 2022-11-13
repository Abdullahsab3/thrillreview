import Axios from 'axios'
import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card'
import { User } from './User'
import { Navigate } from 'react-router-dom';
import { setUserInLocalstorage, fetchUserFromLocalStorage } from './localStorageProcessing'
import { backendServer } from './helpers'
import InputGroup from 'react-bootstrap/InputGroup';
import './login.css'
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import ButtonWithLoading from './buttonWithLoading'
import { Link } from 'react-router-dom';

function Login() {



    const [username, setusername] = useState("");
    const [usernameError, setusernameError] = useState("");
    const [password, setpassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [validated, setValidated] = useState(false);

    const { promiseInProgress } = usePromiseTracker()

    function checkForErrors(data: any): boolean {
        if (data.error) {
            const receivedUsernameError: string = data.username
            const receivedPasswordError: string = data.password
            if (receivedUsernameError) {
                setusernameError(receivedUsernameError);
            }
            if (receivedPasswordError) {
                setPasswordError(receivedPasswordError);
            }

            return true;
        } else {
            return false;
        }
    }

    const handleLoginSubmit: React.FormEventHandler<HTMLFormElement> =

        (event: React.FormEvent<HTMLFormElement>) => {
            setPasswordError("")
            setusernameError("")
            event.preventDefault();
            event.stopPropagation();
            trackPromise(
                Axios.post(backendServer("/login"), {
                    username: username,
                    password: password,
                }).then((res) => {
                    if (checkForErrors((res as any).data)) {
                        setValidated(false)
                    } else {
                        const newUser = new User(username, (res as any).data.id)
                        setUserInLocalstorage(newUser)
                        setValidated(true)
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
        return username !== "" && password !== ""
    }

    if (fetchUserFromLocalStorage()) {
        return (<Navigate replace to="/" />);
    }

    return (
        <div id='Login'>
            <div className="col d-flex justify-content-center">
                <Card className='card' border='secondary'>
                    <Card.Body>
                        <Card.Title ><strong>Log in</strong></Card.Title>
                        <Form noValidate validated={validated} onSubmit={handleLoginSubmit}>

                            <Form.Group className="mb-3">
                                <Form.Label>Username</Form.Label>
                                <InputGroup hasValidation>
                                    <Form.Control
                                        required
                                        type=" text"
                                        onChange={(e) => setusername(e.target.value)}
                                        placeholder="Enter your username"
                                        isInvalid={(usernameError as any)} />
                                    <Form.Control.Feedback type="invalid">
                                        {usernameError}
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Password</Form.Label>
                                <InputGroup hasValidation>
                                    <Form.Control
                                        required
                                        type="password"
                                        onChange={(e) => setpassword(e.target.value)}
                                        placeholder="Enter your password"
                                        isInvalid={(passwordError as any)} />
                                    <Form.Control.Feedback type="invalid">
                                        {passwordError}
                                    </Form.Control.Feedback>
                                </InputGroup>
                                <ButtonWithLoading disabled={!isFormValid() || promiseInProgress} promiseInProgress={promiseInProgress} message="Log In" />

                            </Form.Group>

                        </Form>
                        Or register <Link to="/register"> here </Link>
                    </Card.Body>
                    
                </Card>
            </div>
        </div>

    )
}


export default Login;

