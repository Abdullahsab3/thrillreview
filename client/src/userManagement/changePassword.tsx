import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Axios from 'axios'
import { User } from './User'
import { fetchUserFromLocalStorage, removeUserInLocalstorage } from '../localStorageProcessing'
import { Link, useNavigate } from 'react-router-dom';
import { backendServer } from '../helpers';
import InputGroup from 'react-bootstrap/InputGroup';
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import ButtonWithLoading from '../higherOrderComponents/buttonWithLoading';
import './styling/userMangement.css';
import { LoginFirstCard }  from '../higherOrderComponents/cardWithLinkTo';

/**
 * 
 * @returns A page to change the password of the user
 * The user is requested to enter their old password
 * along with their new desired password, making sure they repeat it again.
 */
export default function ChangePassword() {

    const navigate = useNavigate()
    const savedUser: User | null = fetchUserFromLocalStorage();
    const [oldPassword, setOldPassword] = useState("")
    const [oldPasswordError, setOldPasswordError] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [newPasswordError, setNewPasswordError] = useState("")
    const [validated, setValidated] = useState(false)

    const { promiseInProgress } = usePromiseTracker()

    function checkForErrors(data: any): boolean {

        const receievedOldPasswordError: string = data.password
        const receievdNewPasswordError: string = data.newPassword
        if (data.error) {
            setOldPasswordError(data.error)
            return true;
        }
        if (receievedOldPasswordError) {
            setOldPasswordError(receievedOldPasswordError)
            return true;
        }
        if (receievdNewPasswordError) {
            setNewPasswordError(receievdNewPasswordError)
            return true;
        }
        else {
            return false;
        }
    }


    const handleChangePassword: React.FormEventHandler<HTMLFormElement> =
        (event: React.FormEvent<HTMLFormElement>) => {
            setOldPasswordError("")
            setNewPasswordError("")
            event.preventDefault();
            event.stopPropagation();
            trackPromise(
                Axios.put(backendServer("/user/password"), {
                    password: oldPassword,
                    newPassword: newPassword
                }).then((res) => {
                    if ((res as any).data.updated) {
                        setValidated(true)
                        removeUserInLocalstorage()
                        window.location.replace("/")

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
        return oldPassword !== "" && newPassword !== "";
    }

    if (savedUser) {
        return (
            <div className='page'>
                <div className='col d-flex justify-content-center'>
                    <Card className='userManagementCard'>
                        <Card.Body>
                            <Card.Title><strong>Change your password</strong></Card.Title>
                            <Form validated={validated} onSubmit={handleChangePassword}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Password</Form.Label>
                                    <InputGroup hasValidation>
                                        <Form.Control
                                            required
                                            type="password"
                                            onChange={(e) => setOldPassword(e.target.value)}
                                            placeholder="Enter your old password"
                                            isInvalid={(oldPasswordError as any)} />
                                        <Form.Control.Feedback type="invalid">
                                            {oldPasswordError}
                                        </Form.Control.Feedback>
                                    </InputGroup>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Your new password</Form.Label>
                                    <InputGroup hasValidation>
                                        <Form.Control required
                                            type="password"
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="Enter your new Password"
                                            isInvalid={(newPasswordError as any)} />
                                        <Form.Control.Feedback type="invalid">
                                            {newPasswordError}
                                        </Form.Control.Feedback>
                                    </InputGroup>
                                    <ButtonWithLoading disabled={!isFormValid() || promiseInProgress} promiseInProgress={promiseInProgress} message="Submit!" />
                                </Form.Group>
                            </Form>
                        </Card.Body>

                    </Card>
                </div>
            </div>
        );
    } else {
        return (
            <LoginFirstCard />
        )
    }
}