/** @format */

// import * as React from "react";
import * as ReactDOM from "react-dom/client";
import Home from "./Home";
import Login from "./Login";
import VerifyEmail from "./verifyEmail";
import VerifyForgotPasswordToken from "./ResetPassword";
import { ResetPassword } from "./ResetPassword";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Chat from "./Chat";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login/oauth",
    element: <Login />,
  },
  {
    path: "/email-verifications",
    element: <VerifyEmail />,
  },
  {
    path: "/forgot-password",
    element: <VerifyForgotPasswordToken />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/chat",
    element: <Chat />,
  },
]);

document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("root");
  if (!container) {
    const root = ReactDOM.createRoot(container);
    root.render(
        <RouterProvider router={router} />
    );
  }
});
export default router;
