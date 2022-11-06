import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card'
import Alert from 'react-bootstrap/Alert';
import Axios from 'axios'
import { User } from './User'
import { fetchUserFromLocalStorage } from './localStorageProcessing'
import { Link } from 'react-router-dom';
import { backendServer } from './helpers'

export default function ChangePassword() {
    const savedUser: User | null = fetchUserFromLocalStorage();
    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [error, setError] = useState("")


    function handleChangePassword() {
        Axios.post(backendServer("/updatePassword"), {
            password: oldPassword,
            newPassword: newPassword
        }).then((res) => {
            if ((res as any).data.updated) {
                // lelijke tijdelijke oplossing
                window.location.replace("/")
            } else {
                console.log((res as any).data.error)
                setError((res as any).data.error)
            }
        }).catch(function (error) {
            if (error.response) {
                setError(error.response.data.error)
            }
        })
    }

    function isFormValid(): boolean {
        return oldPassword !== "" && newPassword !== "";
    }

    if (savedUser) {
        return (
            <div className='changePassword'>
                <Card className='updatePassword'>
                    <Card.Body>
                        <Card.Title><strong>Change your password</strong></Card.Title>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Your old password</Form.Label>
                                <Form.Control type="password" onChange={(e) => setOldPassword(e.target.value)} placeholder="Enter your old Password" />
                                <Form.Label>Your new password</Form.Label>
                                <Form.Control type="password" onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter your new Password" />
                                <Button onClick={handleChangePassword} variant="primary" disabled={!isFormValid()}>Submit!</Button>
                                {error && <Alert key='warning' variant='warning'>{error}</Alert>}
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