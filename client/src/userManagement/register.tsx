import Axios from 'axios'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form';
import { isValidEmail, backendServer } from '../helpers';
import "./styling/register.css"
import InputGroup from 'react-bootstrap/InputGroup';
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import ButtonWithLoading from '../higherOrderComponents/buttonWithLoading';

function Register() {
  const navigate = useNavigate()

  const { promiseInProgress } = usePromiseTracker()

  const [username, setusername] = useState("")
  const [usernameError, setusernameError] = useState("")
  const [password, setpassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [email, setemail] = useState("")
  const [emailError, setEmailError] = useState("")
  const [validated, setValidated] = useState(false);

  function checkForErrors(data: any): boolean {
    const receivedUsernameError: string = data.username
    const receivedEmailError: string = data.email
    const receivedPasswordError: string = data.password
    console.log(receivedUsernameError)
    if (receivedUsernameError) {
      setusernameError(receivedUsernameError);
      return true;
    }
    if (receivedPasswordError) {
      setPasswordError(receivedPasswordError);
      return true;
    }
    if (receivedEmailError) {
      setEmailError(receivedEmailError)
      return true;
    } else if (data.error) {
      setPasswordError(data.error)
      return true;
    } else {
      return false;
    }
  }

  function checkForInputError(): boolean {
    if (isValidEmail(email)) {
      return false;
    } else {
      setEmailError("Email is not correctly formatted.")
      return true;
    }
  }


  const handleRegisterSubmit: React.FormEventHandler<HTMLFormElement> =
    (event: React.FormEvent<HTMLFormElement>) => {
      setPasswordError("")
      setusernameError("")
      setEmailError("")
      event.preventDefault();
      event.stopPropagation();
      if (checkForInputError()) {
        setValidated(false);
      }
      else {
        trackPromise(
          Axios.post(backendServer("/user"), {
            username: username,
            email: email,
            password: password,
          }).then((res) => {
            if (res.data.added) {
              navigate("/Login")
            } else {
              setValidated(false)
            }
          }).catch(function (error) {
            if (checkForErrors(error.response.data)) {
              setValidated(false)
            }
          })
        )
      }
    }


  function isFormValid(): boolean {
    return username !== "" && password !== "" && email !== ""
  }


  return (
    <div id='register'>
      <div className="col d-flex justify-content-center">
        <Card className='card'>
          <Card.Body>
            <Card.Title><strong>Register</strong></Card.Title>
            <Form noValidate validated={validated} onSubmit={handleRegisterSubmit}>

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
                <Form.Label>Email</Form.Label>
                <InputGroup hasValidation>
                  <Form.Control
                    required
                    type="email"
                    onChange={(e) => setemail(e.target.value)}
                    placeholder="Enter your email"
                    isInvalid={(emailError as any)} />
                  <Form.Control.Feedback type="invalid">
                    {emailError}
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
              </Form.Group>
              <ButtonWithLoading disabled={!isFormValid() || promiseInProgress} promiseInProgress={promiseInProgress} message="Register" />
            </Form>
          </Card.Body>
        </Card>
      </div>
    </div>

  );
}

export default Register;