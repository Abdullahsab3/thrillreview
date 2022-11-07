import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Axios from 'axios'
import { User } from './User'
import { fetchUserFromLocalStorage } from './localStorageProcessing'
import { Link } from 'react-router-dom';
import { backendServer } from './helpers';
import InputGroup from 'react-bootstrap/InputGroup';

export default function ChangePassword() {
    const savedUser: User | null = fetchUserFromLocalStorage();
    const [oldPassword, setOldPassword] = useState("")
    const [oldPasswordError, setOldPasswordError] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [newPasswordError, setNewPasswordError] = useState("")
    const [validated, setValidated] = useState(false)

    function checkForErrors(data: any): boolean {
        console.log(data)
        if (data.error) {
            const receievedOldPasswordError: string = data.password
            const receievdNewPasswordError: string = data.newPassword
            if (receievedOldPasswordError) {
                setOldPasswordError(receievedOldPasswordError)
            }
            if (receievdNewPasswordError) {
                setNewPasswordError(receievdNewPasswordError)
            }
            return true;
        } else {
            return false;
        }
    }


    const handleChangePassword: React.FormEventHandler<HTMLFormElement> =
        (event: React.FormEvent<HTMLFormElement>) => {
            setOldPasswordError("")
            setNewPasswordError("")
            event.preventDefault();
            event.stopPropagation();
            Axios.post(backendServer("/updatePassword"), {
                password: oldPassword,
                newPassword: newPassword
            }).then((res) => {
                if (checkForErrors((res as any).data)) {
                    setValidated(false)
                } else {
                    setValidated(true)
                    // lelijke tijdelijke oplossing
                    window.location.replace("/")
                }
            }).catch(function (error) {
                if (checkForErrors(error.response.data)) {
                    setValidated(false)
                }
            })
        };

    function isFormValid(): boolean {
        return oldPassword !== "" && newPassword !== "";
    }

    if (savedUser) {
        return (
            <div className='col d-flex justify-content-center'>
                <Card className='card'>
                    <Card.Body>
                        <Card.Title><strong>Change your password</strong></Card.Title>
                        <Form noValidate validated={validated} onSubmit={handleChangePassword}>
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
                                <Button className="submitbutton" type="submit" variant="primary" disabled={!isFormValid()}>Submit!</Button>
                               
                            </Form.Group>
                        </Form>
                    </Card.Body>

                </Card>
            </div>
        );
    } else {
        return (
            <div className='changePassword'>
                In order to change your password, you have to <Link to="/Login">Log in first</Link>
            </div>
        )
    }
}