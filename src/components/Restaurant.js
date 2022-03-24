import React, { useState, useEffect, useContext, useRef } from "react";
import classes from "./Restaurant.module.css";
import image from "../images/restaurant.jpg";
import RestaurantList from "../services/restaurants-list";
import Pagination from "./Pagination";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/auth-context";
import ReadOnlyRating from "./Ratings/Read_Only_Rating";
import AddRestauarant from "./AddRestauarant";
import { useCookies } from "react-cookie";

import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./Header";

const Restaurant = ({ restaurantsList, updateRestaurant }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [restaurantsPerPage, setRestaurantsPerPage] = useState(5);
  const navigate = useNavigate();
  let authCtx = useContext(AuthContext);
  const [editModeIsOn, setEditModeIsOn] = useState(false);
  const [currentId, setCurrentId] = useState();


  const FetchRestaurantCallback = React.useCallback(() => {
    RestaurantList.fetchRestaurants()
      .then((res) => {
        updateRestaurant(res.data);
        // setCookie("restaurantList", JSON.stringify(res), { path: "/" });
        toast.success("Restaurants fetched");
      })
      .catch((err) => {
        console.log(err);
      });
  });

  const [tick, setTick] = useState(false);

  useEffect(() => {
    // Getting Restaurants
    FetchRestaurantCallback();
  }, [tick]);

  //Get current restaurants by page
  const indexOfLastRestaurant = currentPage * restaurantsPerPage;
  const indexOfFirstRestaurant = indexOfLastRestaurant - restaurantsPerPage;
  const currentRestaurants = restaurantsList.slice(
    indexOfFirstRestaurant,
    indexOfLastRestaurant
  );

  //Restaurant Delete Handler
  const deleteHandler = (event) => {
    const newRestaurantList = restaurantsList.filter((restaurant) => {
      return restaurant.id !== event.target.id;
    });

    updateRestaurant(newRestaurantList);

    RestaurantList.deleteRestaurant(event.target.id)
      .then((res) => {
        console.log(res);
        console.log("Deleted services");
        toast.warning(res.data.message);
        setTick(!tick); //reload logic
      })
      .catch((err) => {
        console.log(err);
        toast.error(err);
      });
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const EditCard = (item) => {
    RestaurantList.getRestaurantDetails(Number(item.id))
      .then((res) => {
        console.log(res);
        console.log("Restaurant fetched by id successfully");
        toast.success("Restaufrant fetched by id successfully");
        navigate(`./restaurant-detail/${Number(item.id)}`);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //Edit restaurant deatils on homepage
  const EditRestaurantDetailsOnTheHomePage = (event) => {
    setCurrentId(Number(event.target.id)); //this is string, convert to num

    const updatedRestaurantDetails = restaurantsList.filter((restaurant) => {
      return restaurant.id === Number(event.target.id);
    });

    const [title, description, location] = updatedRestaurantDetails;

    if (editModeIsOn) {
      RestaurantList.updateRestaurant(
        Number(event.target.id),
        title,
        description,
        location
      )
        .then((res) => {
          console.log("Updated Successfully");
          toast.success(res.data.message);
          setTick(!tick);
        })
        .catch((err) => {
          toast.error(err);
        });
    }
    setEditModeIsOn(!editModeIsOn);
  };

  //title and description change handler on homepage
  const titleChangeHandler = (event) => {
    updateRestaurant((prevState) => {
      const arr = prevState.map((restaurant) => {
        if (restaurant.id === Number(currentId)) {
          if (event.target.name === "title") {
            return { ...restaurant, title: event.target.value };
          } else if (event.target.name === "description") {
            return { ...restaurant, description: event.target.value };
          } else if (event.target.name === "location") {
            return { ...restaurant, location: event.target.value };
          }
        } else {
          return { ...restaurant };
        }
      });
      return arr;
    });
  };

  return (
    <div>
      <Header />
      {currentRestaurants.map((item) => {
        return (
          <div className={classes.card} key={item.id}>
            <img src={image} alt="restaurant" />

            {Number(currentId) !== item.id ? (
              <React.Fragment>
                <p style={{ marginTop: "20px" }}>
                  <strong>Name:</strong> {item.title}
                </p>
                <p className={classes.desc}>
                  <strong>Description:</strong> {item.description}
                </p>
                <p className={classes.loc}>
                  <strong>Location:</strong> {item.location}
                </p>
              </React.Fragment>
            ) : editModeIsOn ? (
              <React.Fragment>
                <input
                  style={{ marginTop: "20px" }}
                  name="title"
                  value={item.title}
                  onChange={titleChangeHandler}
                ></input>
                <input
                  className={classes.desc}
                  value={item.description}
                  name="description"
                  onChange={titleChangeHandler}
                ></input>
                <input
                  name="location"
                  className={classes.loc}
                  value={item.location}
                  onChange={titleChangeHandler}
                ></input>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <p style={{ marginTop: "20px" }}>
                  <strong>Name:</strong>
                  {item.title}
                </p>
                <p className={classes.desc}>
                  <strong>Description:</strong>
                  {item.description}
                </p>
                <p className={classes.loc}>
                  <strong>Location:</strong> {item.location}
                </p>
              </React.Fragment>
            )}

            <span style={{ marginTop: "20px" }}>
              <strong>Average Rating:</strong>{" "}
              <ReadOnlyRating value={item.averageRating} read={true} />
            </span>
            {authCtx.user.user.isAdmin && (
              <>
                <button
                  className={classes.edit}
                  onClick={EditRestaurantDetailsOnTheHomePage}
                  id={item.id}
                >
                  {editModeIsOn && currentId === item.id ? "SAVE" : "EDIT"}
                </button>
                <button
                  className={classes.delete}
                  id={item.id}
                  onClick={deleteHandler}
                >
                  DELETE
                </button>
               
              </>
            )}
            <button
                  className={classes.showDetails}
                  id={item.id}
                  onClick={() => EditCard(item)}
                >
                  MORE DETAILS
                </button>
          </div>
        );
      })}
      {/* //Add restaurant */}
      {authCtx.user.user.isAdmin && (
        <AddRestauarant
          updateRestaurant={updateRestaurant}
          restaurantsList={restaurantsList}
          reload={() => setTick((tick) => !tick)} //for fetching restaurant
        />
      )}{" "}
      {/* //Pagination       */}
      <Pagination
        postsPerPage={restaurantsPerPage}
        paginate={paginate}
        totalPosts={restaurantsList.length}
      />
    </div>
  );
};

export default Restaurant;
