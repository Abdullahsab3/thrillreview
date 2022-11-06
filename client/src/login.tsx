import Axios from 'axios'
import {useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card'
import { User } from './User'
import { Navigate } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import {setUserInLocalstorage, fetchUserFromLocalStorage} from './localStorageProcessing'
import {backendServer} from './helpers'


function Login() {



    const [username, setusername] = useState("")
    const [password, setpassword] = useState("")

    const [error, setError] = useState("")


    function handleLoginSubmit() {
        Axios.post(backendServer("/login"), {
            username: username,
            password: password,
        }).then((res) => {
            if ((res as any).data.auth) {
                const newUser = new User(username, (res as any).data.id)
                setUserInLocalstorage(newUser)
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
        return username !== "" && password !== ""
    }

    if (fetchUserFromLocalStorage()) {
        return (<Navigate replace to="/" />);
    }

    return (
        <div className='Loginpage'>
            <Card className='Login'>
                <Card.Body>
                    <Card.Title><strong>Log in</strong></Card.Title>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type=" text" onChange={(e) => setusername(e.target.value)} placeholder="Enter your username" />
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" onChange={(e) => setpassword(e.target.value)} placeholder="Enter your password" />
                            <Button onClick={handleLoginSubmit} variant="primary" disabled={!isFormValid()}>Log in</Button>
                            {error && <Alert key='warning' variant='warning'>{error}</Alert>}
                        </Form.Group>
                    </Form>
                </Card.Body>

            </Card>
        </div>

    )
}


export default Login;

