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

function Profile() {
    var user: User | null = null



    const savedUser: string | null = localStorage.getItem("user")
    if(savedUser) {
        const found = JSON.parse(savedUser as string)
        user = new User(found.username, found.id)
    }

    function getuserEmail(id: number): string {
        var email: string = ""
        Axios.get("http://localhost:5000/profile").then((res) => {
            email = res.data.email
        })
        return email;
    }

    if(user) {
        return(
            <div className='Profile'>
                <table>
                    <td>name</td>
                    <td>email</td>
                    <td>ID</td>
                    <td>{user.username}</td>
                    <td>{getuserEmail(user.id)}</td>
                    <td>{user.id}</td>
                </table>

            </div>
        )
    }

    return(
        <div className='Profile'>
            In order to view your profile, you have to <Link to="/Login">Log in first</Link>
        </div>
    )



}


export default Profile;

