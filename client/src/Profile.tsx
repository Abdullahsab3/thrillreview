import Axios from 'axios'
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { User } from './User'
import { Route, Routes, useNavigate} from 'react-router-dom'
import { Link } from 'react-router-dom';
import Table from 'react-bootstrap/Table'
import {fetchUserFromLocalStorage} from './localStorageProcessing'
import ChangeUsername from './changeUsername'

function Profile() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("")
    Axios.defaults.withCredentials = true
    var user: User | null = fetchUserFromLocalStorage();

    if (user) {
        getuserEmail(user.id)
    }

    async function getuserEmail(id: number) {
        const res = await Axios.post("http://localhost:5000/profile")
        setEmail(res.data.email)
    }

    if (user) {
        return (

            <div className='Profile'>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Your account information</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <th>user ID</th>
                            <td>{user.id}</td>
                        </tr>
                        <tr>
                            <th>Username</th>
                            <td>{user.username}</td>
                            <td>
                                <Button onClick={() => navigate("/profile/change-username")}>Change username</Button>
                            </td>
                        </tr>
                        <tr>
                            <th>Email</th>
                            <td>{email}</td>
                            <td>
                                <Button  onClick={() => navigate("/profile/change-email")}>Change Email</Button>
                            </td>
                        </tr>

                        <tr>
                            <td></td>
                            <td></td>
                            <td>
                                <Button onClick={() => navigate("/profile/change-password")}>Change Password</Button>
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </div>
        )
    }

    return (
        <div className='Profile'>
            In order to view your profile, you have to <Link to="/Login">Log in first</Link>
        </div>
    )



}


export default Profile;

