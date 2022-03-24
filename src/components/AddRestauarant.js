import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import { v4 as uuidv4 } from "uuid";
import Typography from "@mui/material/Typography";
import RestaurantList from "../services/restaurants-list";
import AuthContext from "../context/auth-context";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  marginBottom: "2rem",
};
//remove this comp, make use of edit rest ...

export default function AddRestauarant({
  restaurantsList,
  updateRestaurant,
  reload,
}) {
  const [open, setOpen] = React.useState(false);
  const titleRef = React.useRef();
  const descRef = React.useRef();
  const locationRef = React.useRef();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const authCtx = React.useContext(AuthContext);

  // let hr = Math.floor(Math.random() * 3) + 3;
  // let lr = Math.floor(Math.random() * 3) + 1;

  const submit = () => {
    if (
      titleRef.current.value &&
      descRef.current.value &&
      locationRef.current.value
    ) {
      const title = titleRef.current.value;
      const description = descRef.current.value;
      const location = locationRef.current.value;
      const newRestaurant = {
        // id: uuidv4(),
        title: titleRef.current.value,
        description: descRef.current.value,
        location: locationRef.current.value,
      };

      updateRestaurant((prevState) => [...prevState, newRestaurant]);
      const jwt = authCtx.user.jwt;
      RestaurantList.addNewRestaurant(title, description, location, jwt)
        .then((res) => {
          console.log(res);
          console.log("Added new restaurant successfully");
          toast.success(res.data.message);
          reload();
        })
        .catch((err) => {
          console.log(err);
          toast.error("Session expired, Please login again");
        });
      setOpen(false);
    } else {
      alert("All fields are required");
    }
  };

  return (
    <div>
      <Button
        style={{
          backgroundColor: "#106164",
          color: "#fff",
          position: "absolute",
          right: "0",
          top: "50%",
        }}
        onClick={handleOpen}
      >
        +
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography style={{ marginBottom: ".5rem" }} variant="h4">
            Add a Restaurant
          </Typography>

          <TextField id="outlined-name" label="Title" inputRef={titleRef} />

          <TextField
            style={{ marginTop: "2rem" }}
            id="outlined-name"
            label="Description"
            inputRef={descRef}
          />

          <TextField
            style={{ marginTop: "2rem" }}
            id="outlined-name"
            label="Location"
            inputRef={locationRef}
          />
          <br></br>

          <Button style={{ marginTop: ".8rem" }} onClick={submit}>
            Add
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
