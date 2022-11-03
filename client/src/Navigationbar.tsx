import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { NavLink } from 'react-router-dom';
import { User } from "./User"
import { useState } from 'react'
import logo from './logo.png'


function Navigationbar() {
    const [user, setUser] = useState<User | null>(null)


    const savedUser: string | null = localStorage.getItem("user")
    if (savedUser && !user) {
        const found = JSON.parse(savedUser as string)
        setUser(new User(found.username, found.id))
    }


    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Navbar.Brand href="/">
                <img
                    src={logo}
                    height="70"
                    className="d-inline-block align-top"
                    alt="Thrillreview logo"
                />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls='navigationbarscroll' />
            <Navbar.Collapse id="navigationbarscroll" data-bs-target="#navigationbarscroll">
                <Nav className="topnav" variant="pills">
                    <NavLink className="pageLink" to="/">Home</NavLink>
                    <NavLink className="pageLink" to="/Map">Map</NavLink>
                    <NavLink className="pageLink" to="/Attractions">Attractions</NavLink>
                    <NavLink className="pageLink" to="/Themeparks">Themeparks</NavLink>
                    {!user && <NavLink className="pageLink" to="/login">Login</NavLink>}
                    {!user && <NavLink className="pageLink" to="/register">Register</NavLink>}
                    {user && <NavLink className="pageLink" to="/Profile">Profile</NavLink>}

                </Nav>
            </Navbar.Collapse>
        </Navbar>

    );
}

export default Navigationbar;