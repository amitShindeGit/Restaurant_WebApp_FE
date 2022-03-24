import "./App.css";
import React, { useContext, useEffect, useState } from "react";
import Restaurant from "./components/Restaurant";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import Forbidden from "./components/Forbidden";

import RestaurantDetails from "./components/RestaurantDetailsPage";
import AuthContext from "./context/auth-context";
import Users from "./components/Users";
import { useCookies } from "react-cookie";

import Login from "../src/components/Login";
import Signup from "../src/components/Signup";

import Toast from "./components/Utils/Toast";

function App() {
  const [user, setUser] = useState({});
  const [restaurantsList, setRestaurantsList] = useState([]);
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);

  useEffect(() => {
    //no need
    if (!user.user) {
      if (cookies.user) {
        if (cookies.user.user) {
          setUser(cookies.user);
        }
      }
    }
    //To avoid not found isAdmin property
    // const user = {
    //   user: { name: "", email: "", isAdmin: false, password: "" },
    //   jwt: ''
    // };
    // if (!authCtx.user) {
    //   setUser(user); //setting user to null on refresh
    // } //no need

    //GET COMPONENT NAVBAR IN APP.JS
  }, []);

  function updateRestaurant(value) {
    setRestaurantsList(value);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            exact
            element={
              user.user ? (
                <Restaurant
                  restaurantsList={restaurantsList}
                  updateRestaurant={updateRestaurant}
                />
              ) : (
                <Login />
              )
            }
          />

          <Route
            path="/login"
            element={
              //todo remove userINocalStorage
              user.user ? ( //check herer as weell
              <Forbidden code={false} errorMsg={"A User already logged in!!"} />
              ) : (
                <Login />
              )
            }
          />
          <Route
            path="/signup"
            element={
              user.user ? ( //check herer as weell
              <Forbidden code={false} errorMsg={"A User already logged in!!"} />
              ) : (
                <Signup />
              )
            }
          />
          <Route
            path="/restaurant-detail/:id"
            element={
              user.user ? (
                // user.user.isAdmin ? (
                  <RestaurantDetails  
                    restaurantsList={restaurantsList}
                    updateRestaurant={updateRestaurant}
                  />
                // ) : (
                //   <Forbidden />
                // )
              ) : (
                <Forbidden />
              )
            }
          />
          <Route
            path="/users"
            element={
              user.user ? (
                user.user.isAdmin ? ( //change here for admin user
                  <Users user={user} setUser={setUser} />
                ) : (
                  <Forbidden code={true} errorMsg={"Not Authorized!"} />
                )
              ) : (
                <Forbidden />
              )
            }
          />
        </Routes>
      </BrowserRouter>

      <Toast />
    </AuthContext.Provider>
  );
}

export default App;
