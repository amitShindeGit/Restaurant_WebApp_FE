import React, { useContext, useEffect, useRef, useState } from "react";
import classes from "./Users.module.css";
import AuthContext from "../context/auth-context";
import Button from "@material-ui/core/Button";
import UsersListServices from "../services/User";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import Header from "./Header";

const Users = ({}) => {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const authCtx = useContext(AuthContext);
  const [editModeIsOn, setEditModeIsOn] = useState(false);
  const [currentUserId, setCurrentUserId] = useState();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');


  const [userCookies, setUserCookie] = useCookies(["usersList"]);

  const [Users, setUsers] = useState([]);
  const [tick, setTick] = useState(false);

  useEffect(() => {
    //Fetching users(if any ) fro the backend
    UsersListServices.getUsers()
      .then((res) => {
        console.log(res.data);
        setUsers(res.data);
        console.log(authCtx.user);
        toast.success("Users fetched");
        setUserCookie("usersList", JSON.stringify(res), {
          path: "/",
        }); //storing all users in cookies
      })
      .catch((err) => {
        console.log(err);
      });
  }, [tick]);

  const addUserHandler = (event) => {
    event.preventDefault();
    if (
      nameRef.current.value &&
      emailRef.current.value &&
      passwordRef.current.value
    ) {
      const name = nameRef.current.value;
      const email = emailRef.current.value;
      const password = passwordRef.current.value;

      //Adding user by sending it's deatils to the backend
      UsersListServices.addUser({ name, email, password })
        .then((res) => {
          console.log(res);
          console.log("User added successfully");
          toast.success(res.data.message);
          setTick(!tick);
        })
        .catch((err) => {
          console.log(err);
        });

      nameRef.current.value = "";
      emailRef.current.value = "";
      passwordRef.current.value = "";
    } else {
      alert("All fields are required");
    }
  };

  const userDeleteHandler = (id) => {
    const deletedUser = Users.filter((user) => {
      return user.id === Number(id);
    });

    UsersListServices.deleteUser(Number(id))
      .then((res) => {
        console.log(res);
        setTick(!tick);
        console.log("Delete user successsfullyy");
        toast.success(res.data.message);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err);
      });
  };

  const inputsChangeHandler = (event) => {
    if(event.target.name === 'name'){
      setName(event.target.value);
    }else if(event.target.name === 'email'){
      setEmail(event.target.value);
    }
  }

  const updateUserHandler = (id) => {
    setEditModeIsOn(!editModeIsOn);
    setCurrentUserId(id);

    // const updateUser = Users.filter((user) => {
    //   return user.id === id;
    // });
    const password = passwordRef.current.value;
    const jwt = authCtx.user.jwt;

    if (editModeIsOn && (name || email)) {
      UsersListServices.updateUser(id, name, email, password, jwt)
        .then((res) => {
          console.log(res);
          setTick(!tick);
          console.log("Update user successsfullyy");
          setEditModeIsOn(false);
          setName('');
          setEmail('');
          toast.success(res.data.message);
        })
        .catch((err) => {
          console.log(err);
          toast.error(err);
        });
    }
  };

  return (
    <div className={classes.users}>
      <Header />

      {Users.map((user) => {
        return (
          <div className={classes.usercard} key={user.id}>
            {!editModeIsOn ? (
              <>
                <p className={classes.name}>Name: {user.name}</p>
                <p className={classes.email}>Email: {user.email}</p>
              </>
            )
            :
            user.id === currentUserId && editModeIsOn ?
              (
                <>
                <label>Name</label>
                <input name="name" onChange={inputsChangeHandler} defaultValue={user.name} className={classes.name}></input>
                <label>Email</label>
                <input name="email" onChange={inputsChangeHandler} defaultValue={user.email} className={classes.email}></input>
              </>
              )
              :
              (
                <>
                <p className={classes.name}>Name: {user.name}</p>
                <p className={classes.email}>Email: {user.email}</p>
              </>
              )
            }
            {/* <p className={classes.password}>Password: {user.password}</p>             */}
            {authCtx.user.user.isAdmin && (
              <React.Fragment>
                <button
                  className={classes.userBtn}
                  variant="contained"
                  color="secondary"
                  onClick={() => updateUserHandler(user.id)}
                >
                  {!editModeIsOn ? 'Edit' : 'Save'}
                </button>
                <button
                  className={classes.userDelBtn}
                  variant="contained"
                  color="secondary"
                  onClick={() => userDeleteHandler(Number(user.id))}
                >
                  Delete
                </button>
              </React.Fragment>
            )}
          </div>
        );
      })}

      {authCtx.user.user.isAdmin && (
        <form onSubmit={addUserHandler} className={classes.usersForm}>
          <label htmlFor="name">Name:</label>
          <input id="name" ref={nameRef}></input>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" ref={emailRef}></input>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" ref={passwordRef}></input>
          <Button variant="contained" color="primary" type="submit">
            Add Users?
          </Button>
        </form>
      )}
    </div>
  );
};

export default Users;
