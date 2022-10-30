import Axios from 'axios'
import { useState } from 'react';

function Register() {
    const [usernameReg, setusernameReg] = useState("")
    const [passwordReg, setpasswordReg] = useState("")
    const [emailReg, setemailReg] = useState("")


  function register() {
    Axios.post("http://localhost:5000/register" , {
      username: usernameReg,
      email: emailReg,
      password: passwordReg,
    }).then((response) => {console.log(response)})
  }



  return (
      <div className='Registration'>
        <h1>Register</h1>
        <label>Username</label>
        <input 
        type="text"
        onChange={(e) => setusernameReg(e.target.value)}
        />
        <label>Email</label>
        <input 
        type="text"
        onChange={(e) => setemailReg(e.target.value)}
        />
        <label>Password</label>
        <input
          type="password"
          onChange={(e) => setpasswordReg(e.target.value)}/>
        <button onClick={register}>Register</button>
      </div>
  );
}

export default Register;