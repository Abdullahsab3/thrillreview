import './styling/Navigationbar.scss';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { NavLink as RouterLink } from 'react-router-dom';
import { User } from "./userManagement/User"
import { useState } from 'react'
import logo from './media/logo.png'


function Navigationbar() {
    const [user, setUser] = useState<User | null>(null)


    const savedUser: string | null = localStorage.getItem("user")
    if (savedUser && !user) {
        const found = JSON.parse(savedUser as string)
        setUser(new User(found.username, found.id))
    }

    // why I use both navlink from bootstrap & router : https://stackoverflow.com/questions/56464444/collapseonselect-in-react-bootstrap-navbars-with-react-router-dom-navlinks 
    // <Nav.Link as={RouterLink} className="pageLink" eventKey="1" to="/">Home</Nav.Link>
    //  {!user && <Nav.Link as={RouterLink} className="pageLink" eventKey="6" to="/register">Register</Nav.Link>}
    return (
        <Navbar className='navigationbar' collapseOnSelect expand="lg" bg="dark" variant="dark">
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
                    <Nav.Link as={RouterLink} className="pageLink" eventKey="2" to="/Map">Map</Nav.Link>
                    <Nav.Link as={RouterLink} className="pageLink" eventKey="3" to="/Attractions">Attractions</Nav.Link>
                    <Nav.Link as={RouterLink} className="pageLink" eventKey="4" to="/Themeparks">Themeparks</Nav.Link>
                    {!user && <Nav.Link as={RouterLink} id="loginLink" className="pageLink" eventKey="5" to="/login">Login</Nav.Link>}
                    {user && <Nav.Link as={RouterLink} className="pageLink" eventKey="7" to="/Profile">Profile</Nav.Link>}
                </Nav>
            </Navbar.Collapse>
        </Navbar>

    );
}

export default Navigationbar;