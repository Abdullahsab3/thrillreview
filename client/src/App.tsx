import './styling/App.css';
import Navigationbar from './Navigationbar';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Routes } from 'react-router-dom'
import Home from './home/Home';
import Map from './Map'
import ThemePark from './themeParks/ThemeParks';
import Attractions from './attractions/Attractions';
import Login from './userManagement/login'
import Profile from './userManagement/Profile'
import Register from './userManagement/register';
import { HelmetProvider } from 'react-helmet-async'; // moet om mem leaks te voorkomen als je met helmet werkt
import ChangeUsername from './userManagement/changeUsername';
import ChangePassword from './userManagement/changePassword';
import ChangeEmail from './userManagement/changeEmail';
import AddAttraction from './attractions/addAttraction';
import AttractionPage from './attractions/attractionPage';
import AddThemePark from './themeParks/addThemePark';
import BrowseAttractions from './attractions/browseAttractions';
import UploadAvatar from './userManagement/uploadAvatar';
import  Axios from 'axios';
import ThemeParkPage from './themeParks/themeparksPage';
import BrowseThemeparks from './themeParks/browseThemeParks';

function App() {

  Axios.defaults.withCredentials = true


  return (
    /* Abdullah: navigationbar wordt een keer gerenderd. Op zich geen probleem 
        maar bij het inloggen zou hij opnieuw gerenderd moeten worden zodat de opties
        verandere. Nu is het tijdelijk opgelost door de pagina te refreshen, maar 
        het is een lelijke tijdelijke oplossing
        */

    //<HelmetProvider>
    /* react-router-dom v6 does not support optional parameters. https://stackoverflow.com/questions/70005601/alternate-way-for-optional-parameters-in-v6 */
      <div className="whole-website">
        <Router>
          <header>
          <Navigationbar />
          </header>
          <div className="middle">
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
            <Route path='/profile/upload-avatar' element={<UploadAvatar/>}/>
            <Route path='/add-attraction' element={<AddAttraction />} />
            <Route path="/addThemePark" element={<AddThemePark />}/>
            <Route path='/Attractions/:attractionID' element={<AttractionPage/>}/>
            <Route path='/browse-attractions/:query' element={<BrowseAttractions/>}/>
            <Route path='/browse-attractions/' element={<BrowseAttractions/>}/> 
            <Route path='Themeparks/:themeParkID' element={<ThemeParkPage/>}/>
            <Route path='/browse-themeparks/:query' element={<BrowseThemeparks/>}/>
          </Routes>
          </div>
        </Router>

      </div>
    //</HelmetProvider>

  );
}



export default App;
