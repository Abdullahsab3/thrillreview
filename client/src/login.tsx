import Axios from 'axios'
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card'

function Login() {

    const [username, setusername] = useState("")
    const [password, setpassword] = useState("")


    function login() {
        Axios.post("http://localhost:5000/login" , {
          username: username,
          password: password,
        }).then((response) => {console.log(response)})
    }

    function isFormValid(): boolean {
        return username !== "" && password !== ""
    }


    return(

    <div className='Loginpage'>
        <Card className='Login'>
            <Card.Body>
                <Card.Title><strong>Log in</strong></Card.Title>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type=" text" onChange={(e) => setusername(e.target.value)} placeholder="Enter your username"/>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" onChange={(e) => setpassword(e.target.value)} placeholder="Enter your password"/>
                        <Button onClick={login} variant="primary" disabled={!isFormValid()}>Log in</Button>
                    </Form.Group>
                </Form>
            </Card.Body>

        </Card>
      </div>
      
    )
}


export default Login;

