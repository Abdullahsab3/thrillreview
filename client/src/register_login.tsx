import Axios from 'axios'
import { useState } from 'react';

function RegLog() {
    const [usernameReg, setusernameReg] = useState("")
    const [passwordReg, setpasswordReg] = useState("")
    const [emailReg, setemailReg] = useState("")

    const [username, setusername] = useState("")
    const [password, setpassword] = useState("")

  function register() {
    Axios.post("http://localhost:5000/register" , {
      username: usernameReg,
      email: emailReg,
      password: passwordReg,
    }).then((response) => {console.log(response)})
  }

  function login() {
    Axios.post("http://localhost:5000/login" , {
      username: username,
      password: password,
    }).then((response) => {console.log(response)})
  }


  return (
    <div className="regLog">
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
      <div className='Login'>
        <h1>Log in</h1>
        <label>Username</label>
        <input type="text" onChange={(e) => setusername(e.target.value)}/>
        <label>Password</label>
        <input type="password" onChange={(e) => setpassword(e.target.value)}/>
        <button onClick={login}>Log in</button>
      </div>
    </div>  
  );
}

export default RegLog;