import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter

ReactDOM.render(
  <BrowserRouter>
    {" "}
    {/* Wrap your App with BrowserRouter */}
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);
