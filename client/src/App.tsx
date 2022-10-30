//import React from 'react';
//import logo from './logo.svg';
import './App.css';
import Navigationbar from './Navigationbar';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import {Routes} from 'react-router-dom'
import Home from './Home';
import Map from './Map'
import ThemePark from './ThemeParks';
import Attractions from './Attractions';
import Login from './login'
import Profile from './Profile'
import Register from './register';
import {useState} from 'react'
import {User} from './User'

function App() {

  const [user, setUser] = useState<User | null>(null)


  return (
    // om de een of andere reden geeft het errors als ik het nergens inzet

    /* Abdullah: navigationbar wordt een keer gerenderd. Op zich geen probleem 
        maar bij het inloggen zou hij opnieuw gerenderd moeten worden zodat de opties
        verandere. Nu is het tijdelijk opgelost door de pagina te refreshen, maar 
        het is een lelijke tijdelijke oplossing
        */

    <div className="Navigation-toolbar">  
      <Router>
      <Navigationbar/>     
        <Routes>       
        <Route path='/' element={<Home/>}/>
        <Route path='/Map' element={<Map/>}/>
        <Route path='/Attractions' element={<Attractions/>}/>
        <Route path='/Themeparks' element={<ThemePark/>}/>
        <Route path ='/Login' element={<Login/>}/>
        <Route path ='/Register' element ={<Register/>}/>
        <Route path='/Profile' element={<Profile/>}/>

        </Routes>
      </Router>
      
    </div>
  
    //<div className="App">
    //<Header title='Hello World' color = 'violet' />
    //</div>
  );
}



export default App;
