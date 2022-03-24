import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import classes from "./Header.module.css";
import AuthContext from "../context/auth-context";
import { useCookies } from "react-cookie";
import {  toast } from "react-toastify";



const Header = () => {
  let authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);


  const logoutHandler = () => {
    authCtx.setUser({});
    removeCookie("user");
    if (authCtx.user.email) {
      toast.warning("Logged Out!");
    }
    navigate("/login");
  };

  const homeNavigateHandler = () => {
      navigate("/");
  }

  const userNavigateHandler = () => {
      navigate("/users");
  }

  return (
    <div className={classes.header}>

    <div className={classes.navbar}>
      <ul >
        <li>
          <a style={{ color: "#fff" }}  onClick={homeNavigateHandler} >Restaurants</a>
        </li>
        {authCtx.user.user.isAdmin && (
          <li>
            <a style={{ color: "#fff" }} onClick={userNavigateHandler} >Users</a>
          </li>
        )}
        <li>
          <a style={{ color: "#fff" }} onClick={logoutHandler}>
            {authCtx.user.user.email ? "Logout" : "Login"}
          </a>
        </li>
      </ul>
      </div>

      <div className={classes.user}>
          <p>CurrentUser: <span style={{ color: "#FFFFCC" }}> {authCtx.user.user.email} </span></p>
      </div>

    </div>
  );
};

export default Header;
