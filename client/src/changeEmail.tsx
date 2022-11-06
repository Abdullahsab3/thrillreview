import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card'
import Alert from 'react-bootstrap/Alert';
import Axios from 'axios'
import { User } from './User'
import { fetchUserFromLocalStorage, setUserInLocalstorage } from './localStorageProcessing'
import { Link } from 'react-router-dom';
import { isValidEmail, backendServer } from './helpers';


export default function ChangeEmail() {
    const savedUser: User | null = fetchUserFromLocalStorage();
    const [newEmail, setNewEmail] = useState("")
    const [error, setError] = useState("")


    function handleChangeEmail() {
        Axios.post(backendServer("/updateEmail"), {
            newEmail: newEmail
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
        return newEmail !== "" && isValidEmail(newEmail);
    }

    if (savedUser) {

        return (
            <div className='changeEmail'>
                <Card className='updateEmail'>
                    <Card.Body>
                        <Card.Title><strong>Change your username</strong></Card.Title>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>New username</Form.Label>
                                <Form.Control type=" text" onChange={(e) => setNewEmail(e.target.value)} placeholder="Enter your new email" />
                                <Button onClick={handleChangeEmail} variant="primary" disabled={!isFormValid()}>Submit your email!</Button>
                                {error && <Alert key='warning' variant='warning'>{error}</Alert>}
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