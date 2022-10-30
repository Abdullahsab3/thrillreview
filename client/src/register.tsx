import Axios from 'axios'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert'

function Register() {
  const navigate = useNavigate()

  const [username, setusername] = useState("")
  const [password, setpassword] = useState("")
  const [email, setemail] = useState("")

  const [error, setError] = useState("")


  function handleRegistersubmit() {
    if (isValidEmail(email)) {
      Axios.post("http://localhost:5000/register", {
        username: username,
        email: email,
        password: password,
      }).then((response) => {
        if (response.data.registered) {
          navigate("/login")
        }
      }).catch(function (error) {
        if(error.response) {
          setError(error.response.data.error)
        }
      })
    } else {
      setError("Email is invalid")
    }
  }

  function isFormValid(): boolean {
    return username !== "" && password !== "" && email !== ""
  }

  function isValidEmail(email: string) {
    return /\S+@\S+\.\S+/.test(email);
  }



  return (
    <div className='RegisterPage'>
      <Card className='Register'>
        <Card.Body>
          <Card.Title><strong>Register</strong></Card.Title>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control type=" text" onChange={(e) => setusername(e.target.value)} placeholder="Enter your username" />
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" onChange={(e) => setemail(e.target.value)} placeholder="someone@example.com" />
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" onChange={(e) => setpassword(e.target.value)} placeholder="Enter your password" />
              <Button onClick={handleRegistersubmit} variant="primary" disabled={!isFormValid()}>Register</Button>
              {error && <Alert key='warning' variant='warning'>{error}</Alert>}
            </Form.Group>
          </Form>
        </Card.Body>

      </Card>
    </div>

  );
}

export default Register;