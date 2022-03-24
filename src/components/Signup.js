import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Auth from "../services/Auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
import User from "../services/User";

import isEmail from "validator/lib/isEmail";
import isStrongPassword from "validator/lib/isStrongPassword";

const theme = createTheme();

export default function SignUp() {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();

  const [error, setError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

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
    event.preventDefault();

    if (
      nameRef.current.value &&
      emailRef.current.value &&
      passwordRef.current.value
    ) {
      const newSignedUpUserUser = {
        name: nameRef.current.value,
        email: emailRef.current.value,
        // isAdmin: isAdminRef.current.checked,
        password: passwordRef.current.value,
      };

      const name = nameRef.current.value;
      const email = emailRef.current.value;
      const password = passwordRef.current.value;

      //Api POST
      Auth.postSignupUser({ name, email, password })
        .then((res) => {
          console.log(res);
          console.log("User signed in");
          toast.success(res.data.message);

          // User.addUser(newSignedUpUserUser)
          //   .then((res) => {
          //     toast.success(res.data.message);
          //   })
          //   .catch((err) => {
          //     toast.error(err);
          //   });
          navigate("/login");
        })
        .catch((err) => {
          console.log(err);
          toast.error(err);
        });
    } else {
      toast.error("All fields are required");
    }
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
            Sign Up
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
              id="name"
              inputRef={nameRef}
              label="Full Name"
              name="name"
              autoComplete="name"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              inputRef={emailRef}
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
              inputRef={passwordRef}
              name="password"
              label="Password"
              type="password"
              id="password"
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
              Sign Up
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="/" variant="body2">
                  &#8592; HomePage?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/login" variant="body2">
                  {"Already have an account? Log In"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
