import Axios from 'axios'
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card'
import { User } from './User'
import { RedirectFunction } from 'react-router-dom'
import { Navigate } from 'react-router-dom';


function Login() {

    const [username, setusername] = useState("")
    const [password, setpassword] = useState("")

    const [user, setUser] = useState<User>()


    async function handleLoginSubmit() {
        const res = await Axios.post("http://localhost:5000/login", {
            username: username,
            password: password,
        })
        if ((res as any).data.auth) {
            const newUser = new User(username, (res as any).data.id)
            setUser(newUser)
            localStorage.setItem('user', '{"username": ' + `"${newUser.username}"` + ', "id": ' + newUser.id + '}')
        }
    }

    function isFormValid(): boolean {
        return username !== "" && password !== ""
    }

    if (user) {
        return (<Navigate to="/" />);
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
                        </Form.Group>
                    </Form>
                </Card.Body>

            </Card>
        </div>

    )
}


export default Login;

