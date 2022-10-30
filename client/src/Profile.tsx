import Axios from 'axios'
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card'
import { User } from './User'
import { RedirectFunction } from 'react-router-dom'
import { Navigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { UserInfo } from 'os';
import Table from 'react-bootstrap/Table'

function Profile() {

    const [email, setEmail] = useState("")
    Axios.defaults.withCredentials = true

    var user: User | null = null



    const savedUser: string | null = localStorage.getItem("user")
    if (savedUser) {
        const found = JSON.parse(savedUser as string)
        user = new User(found.username, found.id)
        getuserEmail(user.id)
    }

    async function getuserEmail(id: number) {
        const res = await Axios.get("http://localhost:5000/profile")
        setEmail(res.data.email)
    }

    if (user) {
        return (
            <div className='Profile'>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{user.id}</td>
                            <td>{user.username}</td>
                            <td>{email}</td>
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

