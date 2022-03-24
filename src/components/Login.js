import React, { useContext, useEffect, useRef, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useCookies } from "react-cookie";
import isEmail from "validator/lib/isEmail";
import isStrongPassword from "validator/lib/isStrongPassword";

//my imports
import AuthContext from "../context/auth-context";
import { useNavigate } from "react-router-dom";
import Auth from "../services/Auth";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const theme = createTheme();

export default function Login() {
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const emailRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const [cookies, setCookie, removeCookie] = useCookies(["user"]);

  const changeHandler = () => {
    if (isEmail(emailRef.current.value)) {
      setError(false);
    } else {
      setError(true);
    }
  };

  const passwordValidator = () => {
    if (isStrongPassword(passwordRef.current.value)) {
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  const handleSubmit = (event) => {
    //onSubmitClick => FE validation-> true -> BE -> res-> true -> redirect to page -.
    //           fail-> error;
    event.preventDefault();

    if (emailRef.current.value && passwordRef.current.value) {
      //Api call for login-GET USER  //correct it
      const email = emailRef.current.value;
      let isAdmin = Math.random() < 0.5; //random admin or user
      // isAdmin: true,    //not random now
      const password = passwordRef.current.value;
      Auth.getLoggedInUser({ email, password })
        .then((res) => {
          console.log("LOGIN USER", res);
          console.log("User fetched");
          toast.success(res.data.message);

          authCtx.setUser(res.data);

          setCookie("user", JSON.stringify(res.data), {
            path: "/",
          });
        })
        .catch((err) => {
          // console.log(err);
          toast.error("err");
        });
    } else {
      toast.error("All fields are required");
    }
    navigate("/");
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Log in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              inputRef={emailRef}
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={changeHandler}
              error={error}
              helperText={error ? "check your email" : ""}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              inputRef={passwordRef}
              autoComplete="current-password"
              onChange={passwordValidator}
              error={passwordError}
              helperText={
                passwordError
                  ? "(minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1)"
                  : ""
              }
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={error || passwordError}
            >
              Log In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="/" variant="body2">
                  &#8592; HomePage?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
