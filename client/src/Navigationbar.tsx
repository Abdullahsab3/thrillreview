import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import { NavLink } from 'react-router-dom';
import { User } from "./User"
import { useState } from 'react'


function Navigationbar() {
    var user: User;

    const savedUser: string | null = localStorage.getItem("user")
    if (savedUser) {
        const found = JSON.parse(savedUser as string)
        user = new User(found.username, found.id)
    }

    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Navbar.Toggle aria-controls='navigationbarscroll' />
            <Navbar.Collapse id="navigationbarscroll" data-bs-target="#navigationbarscroll">
                <Nav className="topnav" variant="pills">
                    <NavLink className="pageLink" to="/">Home</NavLink>
                    <NavLink className="pageLink" to="/Map">Map</NavLink>
                    <NavLink className="pageLink" to="/Attractions">Attractions</NavLink>
                    <NavLink className="pageLink" to="/Themeparks">Themeparks</NavLink>
                    {!savedUser && <NavLink className="pageLink" to="/login">Login</NavLink> }             
                    {! savedUser && <NavLink className="pageLink" to="/register">Register</NavLink>}
                    {savedUser && <NavLink className="pageLink" to="/Profile">Profile</NavLink>}
                    
                </Nav>
            </Navbar.Collapse>
        </Navbar>

    )
}

export default Navigationbar