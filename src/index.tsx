import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import App from './App';
import { RootProvider } from "./context";
import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <RootProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </RootProvider>
  </React.StrictMode>,
  document.getElementById("root")
);