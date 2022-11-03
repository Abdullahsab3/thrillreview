//import React from 'react';
//import logo from './logo.svg';
import './App.css';
import Navigationbar from './Navigationbar';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Routes } from 'react-router-dom'
import Home from './Home';
import Map from './Map'
import ThemePark from './ThemeParks';
import Attractions from './Attractions';
import Login from './login'
import Profile from './Profile'
import Register from './register';
import { useState } from 'react'
import { User } from './User'
import { HelmetProvider } from 'react-helmet-async'; // moet om mem leaks te voorkomen als je met helmet werkt
import ChangeUsername from './changeUsername';
import ChangePassword from './changePassword';
import ChangeEmail from './changeEmail';
import AddAttraction from './addAttraction';

function App() {

  const [user, setUser] = useState<User | null>(null)


  return (
    /* Abdullah: navigationbar wordt een keer gerenderd. Op zich geen probleem 
        maar bij het inloggen zou hij opnieuw gerenderd moeten worden zodat de opties
        verandere. Nu is het tijdelijk opgelost door de pagina te refreshen, maar 
        het is een lelijke tijdelijke oplossing
        */

    <HelmetProvider>
      <div className="Navigation-toolbar">
        <Router>
          <Navigationbar />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/Map' element={<Map />} />
            <Route path='/Attractions' element={<Attractions />} />
            <Route path='/Themeparks' element={<ThemePark />} />
            <Route path='/Login' element={<Login />} />
            <Route path='/Register' element={<Register />} />
            <Route path='/Profile' element={<Profile />} />
            <Route path='/Profile/change-username' element={<ChangeUsername/>} />
            <Route path='/Profile/change-email' element={<ChangeEmail/>}/>
            <Route path='/Profile/change-password' element={<ChangePassword/>}/>
            <Route path='/addAttraction' element={<AddAttraction />} />
            

          </Routes>
        </Router>

      </div>
    </HelmetProvider>

  );
}



export default App;
