import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import classes from "./Restaurant_Details.module.css";
import image from "../images/restaurant.jpg";
import ReadOnlyRating from "./Ratings/Read_Only_Rating";
import RestaurantList from "../services/restaurants-list";
import DeleteIcon from "@mui/icons-material/Delete";
import ReviewService from "../services/reviews-api";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthContext from "../context/auth-context";
import Header from "./Header";

const Restaurant_Details = ({ restaurantsList, updateRestaurant }) => {
  const params = useParams();
  const [editRestaurantModeIsOn, setEditRestaurantModeIsOn] = useState(false);
  const [clickedRestaurant, setClickedRestaurant] = useState({});
  const [tick, setTick] = useState(false);
  const [reviews, setReviews] = useState({});
  const authCtx = useContext(AuthContext);
  const [value, setValue] = useState(0);
  const commentRef = useRef();

  useEffect(() => {
    RestaurantList.fetchRestaurants()
      .then((res) => {
        updateRestaurant(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    RestaurantList.getRestaurantDetails(Number(params.id))
      .then((res) => {
        setClickedRestaurant(res.data.restaurant);
        console.log(res.data, "------------------------------");
        setReviews(res.data);
      })
      .catch((err) => {
        toast.error(err);
      });
  }, [tick]);

  const commentSubmitHandler = (event) => {
    event.preventDefault();

    const comment = commentRef.current.value;
    const id = Number(clickedRestaurant.id);
    const jwt = authCtx.user.jwt;

    if (value && comment) {
      ReviewService.addReview(id, value, comment, jwt)
        .then((res) => {
          console.log(res);
          console.log("Add review successfully");
          toast.success(res.data.message);
          setTick(!tick);
          setValue(0);
          commentRef.current.value = '';
        })
        .catch((err) => {
          console.log(err);
          toast.error("Already rated, can't rate again!");
        });
    } else {
      toast.error("All fields are mandatory!");
    }
  };

  const EditRestaurant = (event) => {
    const updatedRestaurantDetails = restaurantsList.filter((restaurant) => {
      return restaurant.id === Number(clickedRestaurant.id);
    });

    const [title, description] = updatedRestaurantDetails;

    if (editRestaurantModeIsOn) {
      RestaurantList.updateRestaurant(
        Number(clickedRestaurant.id),
        title,
        description
      )
        .then((res) => {
          toast.success(res.data.message); //add message
          setTick(!tick);
        })
        .catch((err) => {
          toast.error(err);
        });
    }
    setEditRestaurantModeIsOn(!editRestaurantModeIsOn);
  };

  //Title and description change handler
  const titleChangeHandler = (event) => {
    updateRestaurant((prevState) => {
      const arr = prevState.map((restaurant) => {
        if (restaurant.id === Number(event.target.id)) {
          if (event.target.name === "title") {
            return { ...restaurant, title: event.target.value };
          } else if (event.target.name === "description") {
            return { ...restaurant, description: event.target.value };
          } else {
            return { ...restaurant };
          }
        } else {
          return { ...restaurant };
        }
      });
      return arr;
    });
  };

  //Ratings change handler
  const highestRatingChangeHandler = (event) => {
    if (editRestaurantModeIsOn) {
      if (event.target.name === "rating") {
        const rating = Number(event.target.value);
        setReviews({ ...reviews }, (reviews.highestRating.rating = rating));
      }

      if (event.target.name === "comment") {
        const comment = event.target.value;
        setReviews({ ...reviews }, (reviews.highestRating.comment = comment));
      }

      const id = reviews.highestRating.id;
      const dateOfVisit = reviews.highestRating.dateOfVisit;
      const jwt = authCtx.user.jwt;
      ReviewService.updateReviews(
        id,
        event.target.name === "rating"
          ? Number(event.target.value)
          : reviews.highestRating.rating,
        event.target.name === "comment"
          ? event.target.value
          : reviews.highestRating.comment,
        dateOfVisit,
        jwt
      )
        .then((res) => {
          console.log(res);
          console.log("update review successfully");
          toast.success(res.data.message);
        })
        .catch((err) => {
          console.log(err);
          toast.error("Session expired, Please login again");
        });
    }
  };

  const LowestReviewChangeHandler = (event) => {
    if (editRestaurantModeIsOn) {
      if (event.target.name === "rating") {
        const rating = Number(event.target.value);
        setReviews({ ...reviews }, (reviews.lowestRating.rating = rating));
      }

      if (event.target.name === "comment") {
        const comment = event.target.value;
        setReviews({ ...reviews }, (reviews.lowestRating.comment = comment));
      }

      const id = reviews.lowestRating.id;
      const dateOfVisit = reviews.lowestRating.dateOfVisit;
      const jwt = authCtx.user.jwt;
      ReviewService.updateReviews(
        id,
        event.target.name === "rating"
          ? Number(event.target.value)
          : reviews.lowestRating.rating,
        event.target.name === "comment"
          ? event.target.value
          : reviews.lowestRating.comment,
        dateOfVisit,
        jwt
      )
        .then((res) => {
          console.log(res);
          console.log("update review successfully");
          toast.success(res.data.message);
        })
        .catch((err) => {
          console.log(err);
          toast.error("Session expired, Please login again");
        });
    }
  };

  const latestRatingChangeHandler = (event) => {
    if (editRestaurantModeIsOn) {
      if (event.target.name === "rating") {
        const rating = Number(event.target.value);
        setReviews({ ...reviews }, (reviews.latestRating.rating = rating));
      }

      if (event.target.name === "comment") {
        const comment = event.target.value;
        setReviews({ ...reviews }, (reviews.latestRating.comment = comment));
      }

      const id = reviews.latestRating.id;
      const dateOfVisit = reviews.latestRating.dateOfVisit;
      const jwt = authCtx.user.jwt;
      ReviewService.updateReviews(
        id,
        event.target.name === "rating"
          ? Number(event.target.value)
          : reviews.latestRating.rating,
        event.target.name === "comment"
          ? event.target.value
          : reviews.latestRating.comment,
        dateOfVisit,
        jwt
      )
        .then((res) => {
          console.log(res);
          console.log("update review successfully");
          toast.success(res.data.message);
        })
        .catch((err) => {
          console.log(err);
          toast.error("Session expired, Please login again");
        });
    }
  };

  //Rating delete handler
  const deleteLowestRatingHandler = (id) => {
    const jwt = authCtx.user.jwt;

    ReviewService.deleteReview(Number(id), jwt)
      .then(() => {
        toast.success("DELETE SUCCESS");
        setTick(!tick);
      })
      .catch((err) => {
        toast.error("Not sufficient permission.");
      });
  };

  return !editRestaurantModeIsOn ? (
    <div className={classes.detailsPage}>
      <Header />
      <div className={classes.card} key={clickedRestaurant.id}>
        <img src={image} alt="restaurant" />
        <p style={{ marginTop: "20px" }}>Name: {clickedRestaurant.title}</p>
        <p className={classes.desc}>
          Desciption: {clickedRestaurant.description}
        </p>
        <p className={classes.loc}>Location: {clickedRestaurant.location}</p>

        <span style={{ marginTop: "20px" }}>
          Average Rating:{" "}
          <ReadOnlyRating value={clickedRestaurant.averageRating} read={true} />
        </span>

        {authCtx.user.user.isAdmin && (
          <button
            style={{ borderStyle: "none", backgroundColor: "cadetblue" }}
            onClick={EditRestaurant}
          >
            Edit Details?
          </button>
        )}
      </div>
      <form
        style={{ display: "inline-block", margin: "2rem 35% .5rem 35%" }}
        onSubmit={commentSubmitHandler}
      >
         <label htmlFor="comment">Rating</label>
        <Box >
          <Rating
            precision={0.5}
            name="rating"
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
            value={value}
            defaultValue={0}
            readOnly={false}
          />
        </Box>

        <label htmlFor="comment">Comment</label>
        <input
          id="comment"
          ref={commentRef}
          style={{ width: "500px", height: "100px", borderRadius:".5rem" }}
        ></input>
        <button
          className={classes.comment}
          variant="contained"
          color="primary"
          type="submit"
        >
          Comment
        </button>
      </form>

      <div className={classes.ratings}>
        <div className={classes.lowRating}>
          <p>
            <u> Lowest Rating: </u>
            {reviews.lowestRating &&
              authCtx.user.user.id === reviews.lowestRating.userId &&
              !authCtx.user.user.isAdmin && (
                <DeleteIcon
                  onClick={() =>
                    deleteLowestRatingHandler(reviews.lowestRating.id)
                  }
                  id={reviews.lowestRating.id}
                  className={classes.deleteIcon}
                />
              )}
            <ReadOnlyRating
              value={reviews.lowestRating ? reviews.lowestRating.rating : 0}
              read={true}
            />{" "}
          </p>

          <h3>
            {reviews.lowestRating ? reviews.lowestRating.name : ""} <br></br>
            <span style={{ fontSize: "1rem", color: "#000" }}>
              <small>
                {reviews.lowestRating ? reviews.lowestRating.dateOfVisit : ""}
              </small>
            </span>
          </h3>
          <p className={classes.commentInput}>
            {reviews.lowestRating ? reviews.lowestRating.comment : ""}
          </p>
        </div>

        <div className={classes.lowRating}>
          <p>
            <u> Highest Rating: </u>
            {reviews.highestRating &&
              authCtx.user.user.id === reviews.highestRating.userId &&
              !authCtx.user.user.isAdmin && (
                <DeleteIcon
                  onClick={() =>
                    deleteLowestRatingHandler(reviews.highestRating.id)
                  }
                  id={reviews.highestRating.id}
                  className={classes.deleteIcon}
                />
              )}
            <ReadOnlyRating
              value={reviews.highestRating ? reviews.highestRating.rating : 0}
              read={true}
            />{" "}
          </p>

          <h3>
            {reviews.highestRating ? reviews.highestRating.name : ""} <br></br>
            <span style={{ fontSize: "1rem", color: "#000" }}>
              <small>
                {reviews.highestRating ? reviews.highestRating.dateOfVisit : ""}
              </small>
            </span>
          </h3>
          <p className={classes.commentInput}>
            {reviews.highestRating ? reviews.highestRating.comment : ""}
          </p>
        </div>

        <div className={classes.lowRating}>
          <p>
            <u> Latest Rating: </u>
            {reviews.latestRating &&
              authCtx.user.user.id === reviews.latestRating.userId &&
              !authCtx.user.user.isAdmin && (
                <DeleteIcon
                  onClick={() =>
                    deleteLowestRatingHandler(reviews.latestRating.id)
                  }
                  id={reviews.latestRating.id}
                  className={classes.deleteIcon}
                />
              )}
            <ReadOnlyRating
              value={reviews.latestRating ? reviews.latestRating.rating : 0}
              read={true}
            />{" "}
          </p>

          <h3>
            {reviews.latestRating ? reviews.latestRating.name : ""} <br></br>
            <span style={{ fontSize: "1rem", color: "#000" }}>
              <small>
                {reviews.latestRating ? reviews.latestRating.dateOfVisit : ""}
              </small>
            </span>
          </h3>
          <p className={classes.commentInput}>
            {reviews.latestRating ? reviews.latestRating.comment : ""}
          </p>
        </div>
      </div>
    </div>
  ) : (
    <div className={classes.detailsPage}>
      <Header />
      <div className={classes.card} key={clickedRestaurant.id}>
        <img src={image} alt="restaurant" />
        <input
          id={clickedRestaurant.id}
          style={{ marginToinput: "20px" }}
          onChange={titleChangeHandler}
          defaultValue={clickedRestaurant.title}
          name="title"
        ></input>
        <input
          className={classes.desc}
          id={clickedRestaurant.id}
          onChange={titleChangeHandler}
          defaultValue={clickedRestaurant.description}
          name="description"
        ></input>
        <p className={classes.loc}>Location: {clickedRestaurant.location}</p>

        <span style={{ marginTop: "20px" }}>
          Average Rating:{" "}
          <ReadOnlyRating value={clickedRestaurant.averageRating} read={true} />
        </span>

        <button
          style={{ borderStyle: "none", backgroundColor: "cadetblue" }}
          onClick={EditRestaurant}
        >
          Save Details?
        </button>
      </div>
      <form
        style={{ display: "inline-block", margin: "2rem 35% .5rem 35%" }}
        onSubmit={commentSubmitHandler}
      >
        <label htmlFor="comment">Rating</label>
        <Box>
          <Rating
            precision={0.5}
            name="rating"
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
            value={value}
            defaultValue={0}
            readOnly={false}
          />
        </Box>

        <label htmlFor="comment">Comment</label>
        <input
          id="comment"
          ref={commentRef}
          style={{ width: "500px", height: "100px", borderRadius:".5rem" }}
        ></input>
        <button
          className={classes.comment}
          variant="contained"
          color="primary"
          type="submit"
        >
          Comment
        </button>
      </form>
      <div className={classes.ratings}>
        <div className={classes.lowRating}>
          <p>
            <u>Lowest Rating: </u>
            <DeleteIcon
              onClick={() => deleteLowestRatingHandler(reviews.lowestRating.id)}
              id={reviews.lowestRating.id}
              className={classes.deleteIcon}
            />
            <ReadOnlyRating
              name="rating"
              value={reviews.lowestRating ? reviews.lowestRating.rating : 0}
              read={false}
              updateRestaurant={updateRestaurant}
              onChangeValue={LowestReviewChangeHandler}
            />
          </p>

          <h3>
            {reviews.lowestRating ? reviews.lowestRating.name : ""} <br></br>
            <span style={{ fontSize: "1rem", color: "#000" }}>
              <small>
                {reviews.lowestRating ? reviews.lowestRating.dateOfVisit : ""}
              </small>
            </span>
          </h3>
          <input
            name="comment"
            defaultValue={reviews.lowestRating && reviews.lowestRating.comment}
            onChange={LowestReviewChangeHandler}
          />
        </div>

        <div className={classes.lowRating}>
          <p>
            <u>Highest Rating: {""}</u>
            <DeleteIcon
              onClick={() =>
                deleteLowestRatingHandler(reviews.highestRating.id)
              }
              id={reviews.highestRating.id}
              className={classes.deleteIcon}
            />
            <ReadOnlyRating
              name="rating"
              value={reviews.highestRating ? reviews.highestRating.rating : 0}
              read={false}
              updateRestaurant={updateRestaurant}
              onChangeValue={highestRatingChangeHandler}
            />
          </p>

          <h3>
            {reviews.highestRating ? reviews.highestRating.name : ""} <br></br>
            <span style={{ fontSize: "1rem", color: "#000" }}>
              <small>
                {reviews.highestRating ? reviews.highestRating.dateOfVisit : ""}
              </small>
            </span>
          </h3>
          <input
            name="comment"
            defaultValue={
              reviews.highestRating && reviews.highestRating.comment
            }
            onChange={highestRatingChangeHandler}
          />
        </div>

        <div className={classes.lowRating}>
          <p>
            <u> Latest Rating: </u>
            <DeleteIcon
              onClick={() => deleteLowestRatingHandler(reviews.latestRating.id)}
              id={reviews.latestRating.id}
              className={classes.deleteIcon}
            />
            <ReadOnlyRating
              name="rating"
              value={reviews.latestRating ? reviews.latestRating.rating : 0}
              read={false}
              updateRestaurant={updateRestaurant}
              onChangeValue={latestRatingChangeHandler}
            />
          </p>

          <h3>
            {reviews.latestRating ? reviews.latestRating.name : ""} <br></br>
            <span style={{ fontSize: "1rem", color: "#000" }}>
              <small>
                {reviews.latestRating ? reviews.latestRating.dateOfVisit : ""}
              </small>
            </span>
          </h3>
          <input
            name="comment"
            defaultValue={reviews.latestRating && reviews.latestRating.comment}
            onChange={latestRatingChangeHandler}
          />
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Restaurant_Details;
