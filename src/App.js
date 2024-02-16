import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Import necessary components from react-router-dom
import "./Styles/App.scss";
// import ColorCrud from "./components/ColorCrud";
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import Header from "./components/header";
import Home from "./components/home";
import ToDos from "./components/todos";
import UserProfile from "./components/userProfile";
import { AuthProvider } from "./contexts/authContext";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Router>
          {" "}
          {/* Wrap your component tree with Router */}
          <Header />
          <div className="w-full h-screen flex flex-col">
            <Routes>
              {" "}
              {/* Define your routes inside Routes */}
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/home" element={<Home />} />
              <Route path="/todos" element={<ToDos />} />
              <Route path="/profile" element={<UserProfile />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
