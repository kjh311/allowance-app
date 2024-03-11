import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="text-center mt-5">
      <br />
      <br />
      <h1 className="welcome-home-title">Welcome to the Allowance App</h1>
      <p>Please login or register to continue.</p>
      <div className="mt-3">
        <Link to="/login" className="btn btn-primary mr-2">
          Login
        </Link>
        <Link to="/register" className="btn btn-secondary">
          Register
        </Link>
      </div>
    </div>
  );
};

export default Home;
