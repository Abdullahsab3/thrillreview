import React from 'react';
import ReactDOM from 'react-dom/client';
//import 'bootstrap/dist/css/bootstrap.min.css'; // DO NOT put it under index.css import, or we are not able to overwrite react-bootstrap (unless we put !important after everything but just leave it as is): https://stackoverflow.com/questions/40738484/how-to-customise-react-bootstrap-components
import './styling/index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';



const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
