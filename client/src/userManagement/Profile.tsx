import Axios from 'axios'
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { getuserAvatar, getuserEmail, User } from './User'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom';
import Table from 'react-bootstrap/Table'
import { fetchUserFromLocalStorage } from '../localStorageProcessing'
import { backendServer } from '../helpers'
import './styling/profile.css'

import { Buffer } from "buffer";


function Profile() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("")
    const [avatar, setAvatar] = useState("")
    var user: User | null = fetchUserFromLocalStorage();



    useEffect(() => {
        if (user) {
            getuserEmail(function (res: string) {
                setEmail(res)
            });
            getuserAvatar(user.id,
                function (res: string) {
                    setAvatar(res)
                });
        }
    }, [])

    if (user) {
        return (
            <div id="profile">
                <h1 className="text-center">Your account information</h1>
                <Table striped bordered hover className="table" id="profilepictureTable">
                    <tbody>

                        <tr><th><img src={avatar} id="profileAvatar" /></th></tr>
                        <tr><th>Your profile avatar</th></tr>
                        <tr><th><Button onClick={() => navigate("/profile/upload-avatar")}>Change your avatar</Button></th></tr>
                    </tbody>
                </Table>

                <div className='table-responsive'>

                    <Table striped bordered hover className="table">

                        <tbody>
                            <tr>
                                <th className="info">user ID</th>
                                <td>{user.id}</td>
                                <td><Button variant="primary" disabled={true} type="submit">Your ID is unique, just like you</Button></td>
                            </tr>
                            <tr>
                                <th className="info">Username</th>
                                <td>{user.username}</td>
                                <td>
                                    <Button onClick={() => navigate("/profile/change-username")}>Change username</Button>
                                </td>
                            </tr>
                            <tr>
                                <th className="info">Email</th>
                                <td>{email}</td>
                                <td>
                                    <Button onClick={() => navigate("/profile/change-email")}>Change Email</Button>
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                    <Table>
                        <tbody>
                            <tr>
                                <th>
                                    <Button onClick={() => navigate("/profile/change-password")}>Change Password</Button>
                                </th>
                            </tr>
                        </tbody>
                    </Table>

                </div>
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

