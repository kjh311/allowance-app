import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="text-center mt-5">
      <br />
      <br />
      <h1 className="welcome-home-title">Welcome to the Allowance App</h1>
      <br />
      <h4 className="app-description">
        Manage your children's allowances and tasks with ease using our
        Allowance App.
      </h4>
      <h4>
        {" "}
        Track money, assign tasks, and teach financial responsibility in a fun
        way.
      </h4>
      <br />
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
