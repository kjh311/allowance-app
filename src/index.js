import React from "react";
import ReactDOM from "react-dom"; // Import react-dom as a default import

import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// console.log(process.env.REACT_APP_API_KEY);
// console.log(process.env.REACT_APP_AUTH_DOMAIN);
// console.log(process.env.REACT_APP_PROJECT_ID);
// console.log(process.env.REACT_APP_STORAGE_BUCKET);
// console.log(process.env.REACT_APP_MESSAGING_SENDER_ID);
// console.log(process.env.REACT_APP_APP_ID);
// console.log(process.env.REACT_APP_MEASUREMENT_ID);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
