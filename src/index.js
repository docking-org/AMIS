import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import Navbar from './Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import ImageBrowser from './Browser/ImageBrowser';
import ViewSlices from './Browser/ViewSlices';
import Browser3d from './Browser/Browser3d';
import FeedbackForm from './Feedback/FeedbackForm';
import NavigationGuide from './Browser/NavigationGuide';
axios.defaults.baseURL = "/"

const router = createBrowserRouter([
  {
    element: <Navbar />,
    children: [
      {
        path: "/",
        element: <App />,
      },
      {
        path: "/image_browser",
        element: <ImageBrowser />,
      },
      {
        path: "/3d_browser",
        element: <Browser3d />,
      },
      {
        path: "/feedback",
        element: <FeedbackForm />,
      },
      {
        path: "/navigation_guide",
        element: <NavigationGuide />,
      }

    ],
  },
  {
    path: "/viewSlices",
    element: <ViewSlices />
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <div>
    <RouterProvider router={router} />
  </div>
);
