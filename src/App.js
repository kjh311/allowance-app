import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Import necessary components from react-router-dom
import "./Styles/App.scss";
// import ColorCrud from "./components/ColorCrud";
import Login from "./components/auth/login";
import ChildLoginPage from "./components/auth/childLogin";
import Register from "./components/auth/register";
import Header from "./components/header";
import StickyFooter from "./components/footer/StickyFooter";
import Home from "./components/home";
import ToDos from "./components/todos";
import UserProfile from "./components/userProfile";
import { AuthProvider } from "./contexts/authContext";
import ChildPage from "./components/children/ChildPage";
import Children from "./components/children";
import Profile from "./components/userProfile";
import { db } from "./firebase/firebase";
import "./Styles/font.scss";

function App() {
  return (
    <div className="App  madimi-one-regular">
      <AuthProvider>
        <Router>
          {" "}
          {/* Wrap your component tree with Router */}
          <Header />
          <div className="w-full h-screen flex flex-col">
            <Routes>
              {" "}
              {/* Define your routes inside Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/childLogin" element={<ChildLoginPage />} />
              <Route path="/register" element={<Register />} />
              <Route path="/home" element={<Home />} />
              <Route path="/todos" element={<ToDos />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/child/:id" element={<ChildPage />} />
              <Route path="/children" element={<Children />} />
            </Routes>
          </div>
          <StickyFooter />
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
