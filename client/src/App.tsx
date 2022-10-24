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

function App() {
  return (
    // om de een of andere reden geeft het errors als ik het nergens inzet
    
    <div className="Navigation-toolbar">  
      <Router>   
      <Navigationbar />     
        <Routes>       
        <Route path='/' element={<Home/>}/>
        <Route path='/Map' element={<Map/>}/>
        <Route path='/Map' element={<Attractions/>}/>
        <Route path='/Themeparks' element={<ThemePark/>}/>
        </Routes>
      </Router>
      
    </div>
  
    //<div className="App">
    //<Header title='Hello World' color = 'violet' />
    //</div>
  );
}



export default App;
