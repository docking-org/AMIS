import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Navbar from './Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import ImageBrowser from './Browser/ImageBrowser';
axios.defaults.baseURL = "http://localhost:5000"

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/image_browser",
    element: <ImageBrowser />
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <div>
    <Navbar></Navbar>
    <RouterProvider router={router} />
  </div>
);
