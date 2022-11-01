import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card'
import Alert from 'react-bootstrap/Alert';
import Axios from 'axios'
import { User } from './User'
import { fetchUserFromLocalStorage, setUserInLocalstorage } from './localStorageProcessing'

export default function ChangeUsername() {
    const savedUser: User | null = fetchUserFromLocalStorage();
    const [newUsername, setNewUsername] = useState("")
    const [error, setError] = useState("")


    function handleChangeUsernameSubmit() {
        Axios.post("http://localhost:5000/updateUsername", {
            newUsername: newUsername
        }).then((res) => {
            if ((res as any).data.updated) {
                (savedUser as User).username = newUsername
                setUserInLocalstorage(savedUser as User);
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
        return newUsername !== "";
    }

    return (
        <div className='changeUsername'>
            <Card className='updateUsername'>
                <Card.Body>
                    <Card.Title><strong>Change your username</strong></Card.Title>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>New username</Form.Label>
                            <Form.Control type=" text" onChange={(e) => setNewUsername(e.target.value)} placeholder="Enter your new username" />
                            <Button onClick={handleChangeUsernameSubmit} variant="primary" disabled={!isFormValid()}>Submit your username!</Button>
                            {error && <Alert key='warning' variant='warning'>{error}</Alert>}
                        </Form.Group>
                    </Form>
                </Card.Body>

            </Card>
        </div>
    );
}