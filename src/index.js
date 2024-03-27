import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from "react-router-dom";
import './css/MainStyle.css';
import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyD-C5-5ycKLz2ZyeSiV8b_CMx-1ZFTM3zo",
    authDomain: "storytree-5fd56.firebaseapp.com",
    databaseURL: "https://storytree-5fd56-default-rtdb.firebaseio.com",
    projectId: "storytree-5fd56",
    storageBucket: "storytree-5fd56.appspot.com",
    messagingSenderId: "570005082339",
    appId: "1:570005082339:web:011771b46a01d82b24f5d6"
  };

const app = initializeApp(firebaseConfig);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>

);
