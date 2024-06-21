import React from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/notes_logo.png";

function Header() {
  return (
    <header>
      <Link to="/" className="logo">
    <img style= {{height:"50px"}}  src={logo} alt="ReactJs" /> NOTE IT!
      </Link>

      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/about">About</NavLink>
      </nav>
    </header>
  );
}

export default Header;
