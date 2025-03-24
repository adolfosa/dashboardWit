// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/main.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import $ from 'jquery';
import 'datatables.net';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);