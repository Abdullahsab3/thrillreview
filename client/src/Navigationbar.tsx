import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import { NavLink } from'react-router-dom';


function Navigationbar(){
    return (        
        <Navbar>
            <Nav className="topnav" variant="pills">
                <NavLink className="pageLink" to="/">Home</NavLink>
                <NavLink className="pageLink" to="/Map">Map</NavLink>  
                <NavLink className="pageLink" to="/Attractions">Attractions</NavLink>  
                <NavLink className="pageLink" to="/Themeparks">Themeparks</NavLink>                    
            </Nav>
        </Navbar>
        
    )
}

export default Navigationbar