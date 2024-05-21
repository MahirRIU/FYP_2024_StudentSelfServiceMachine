import React from 'react'
import {Link} from "react-router-dom";
// import { Route } from 'react-router-dom'
const Home = (props) => {
  return (
    <div>
      <div>
        <h1>
          <Link to="/login">Login</Link>
        </h1>
        <br />
        <h1>
          <Link to="/signup">Signup</Link>
        </h1>
      </div>
      <br />
      <h2>{props.name ? `welcome - ${props.name}` : "login please"}</h2>
    </div>
  );
};

export default Home
