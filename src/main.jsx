
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import Admin from "./Pages/Admin.jsx";
import "./index.css";

const page = window.location.pathname.toLowerCase();

createRoot(document.getElementById("root")).render(
  page === "/admin" ? <Admin /> : <App />
);
