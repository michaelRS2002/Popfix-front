/**
 * @fileoverview Entry point for the React application.
 * Initializes the ReactDOM root, sets up routing using React Router,
 * and defines all public and user-specific routes.
 *
 * @module main
 */

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// IMPORTS
import "./main.scss";

// VIEWS
import { Home } from "./views/Home/Home";
import MovieScreen from "./views/MovieScreen/MovieScreen";
import Login from "./views/Auth/Login/Login";
import Register from "./views/Auth/Register/Register";
import ForgotPassword from "./views/Auth/Forgot-password/Forgot-password";
import ResetPassword from "./views/Auth/Reset-password/Reset-password";
import User from "./views/User/User";
import EditUser from "./views/User/Edit-user/Edit-user";
import DeleteUser from "./views/User/Delete-user/Delete-user";
import ChangePassword from "./views/User/Change-password/Change-password";
import SiteMap from "./views/SiteMap/SiteMap";
import { NotFound } from "./views/NotFound";

/**
 * Renders the root React component into the HTML element with the ID 'root'.
 * The app is wrapped with React.StrictMode for highlighting potential issues
 * and BrowserRouter to enable client-side routing.
 */
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/**
         * Public routes accessible to all users.
         *
         * @route /
         * @component Home - Displays the main landing page.
         *
         * @route /movie/:id
         * @component MovieScreen - Displays detailed information about a specific movie.
         *
         * @route /login
         * @component Login - Allows users to sign in.
         *
         * @route /register
         * @component Register - Allows new users to create an account.
         *
         * @route /forgot-password
         * @component ForgotPassword - Sends a password reset link to the user's email.
         *
         * @route /reset-password
         * @component ResetPassword - Enables users to set a new password using a token.
         */}
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieScreen />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/**
         * User-related routes.
         *
         * @route /user
         * @component User - Displays the user's profile page.
         *
         * @route /edit-user
         * @component EditUser - Allows users to edit their profile information.
         *
         * @route /delete-user
         * @component DeleteUser - Handles account deletion.
         *
         * @route /change-password
         * @component ChangePassword - Allows users to change their password.
         */}
        <Route path="/user" element={<User />} />
        <Route path="/edit-user" element={<EditUser />} />
        <Route path="/delete-user" element={<DeleteUser />} />
        <Route path="/change-password" element={<ChangePassword />} />

        {/**
         * Miscellaneous routes.
         *
         * @route /mapa-del-sitio
         * @component SiteMap - Displays the website's navigation map.
         *
         * @route *
         * @component NotFound - Shown when a route does not exist (404 page).
         */}
        <Route path="/mapa-del-sitio" element={<SiteMap />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
