import React, { useState, useRef } from "react";
import {
  Box,
  Stack,
  Button,
  Typography,
  TextField,
  Card,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useMutation } from "@apollo/client";
import { SIGNUP_MUTATION, LOGIN_MUTATION } from "../graphql/mutations";

const AuthScreen = ({ setIsLoggedIn }) => {
  const [showLogin, setShowLogin] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const authForm = useRef(null);
  const [
    signupUser,
    { data: signupData, loading: signupLoading, error: signupError },
  ] = useMutation(SIGNUP_MUTATION);
  const [
    loginUser,
    { data: loginData, loading: loginLoading, error: loginError },
  ] = useMutation(LOGIN_MUTATION, {
    onCompleted(data) {
      localStorage.setItem("token", data.login.token);
      setIsLoggedIn(true);
    },
  });

  if (signupLoading || loginLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Box textAlign="center">
          <CircularProgress />
          <Typography variant="h6">Authenticating...</Typography>
        </Box>
      </Box>
    );
  }

  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const onSubmit = (e) => {
    e.preventDefault();

    if (showLogin) {
      // login user
      loginUser({
        variables: {
          loginUser: {
            email: formData.email,
            password: formData.password,
          },
        },
      });
    } else {
      signupUser({
        variables: {
          newUser: formData,
        },
      });
    }
  };
  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="80vh"
      ref={authForm}
    >
      <Card sx={{ padding: "10px" }} variant="outlined">
        <Stack sx={{ width: "400px" }} direction="column" spacing={2}>
          {signupData && (
            <Alert severity="success">
              Signup Successfully, Please login to continue...
            </Alert>
          )}
          {signupError && <Alert severity="error">{signupError.message}</Alert>}
          {loginError && <Alert severity="error">{loginError.message}</Alert>}
          <Typography variant="h5">
            Please {showLogin ? "Login" : "Signup"}
          </Typography>
          {!showLogin && (
            <>
              <TextField
                variant="standard"
                name="firstName"
                label="First Name"
                value={formData.firstName}
                onChange={onChange}
                required
              />
              <TextField
                variant="standard"
                name="lastName"
                label="Last Name"
                value={formData.lastName}
                onChange={onChange}
                required
              />
            </>
          )}
          <TextField
            variant="standard"
            name="email"
            label="Email Address"
            value={formData.email}
            type="email"
            onChange={onChange}
            required
          />
          <TextField
            variant="standard"
            name="password"
            label="Password"
            value={formData.password}
            type="password"
            onChange={onChange}
            required
          />
          <Typography
            variant="subtitle1"
            textAlign="center"
            sx={{ cursor: "pointer", color: "#1976d2" }}
            onClick={() => {
              setShowLogin((prev) => !prev);

              setFormData({
                firstName: "",
                lastName: "",
                email: "",
                password: "",
              });

              // authForm.current.reset();
            }}
          >
            {showLogin && "Don't have an account. Signup"}
            {!showLogin && "Already have an account. Login"}
          </Typography>
          <Button variant="outlined" type="submit">
            {showLogin ? "Login" : "Signup"}
          </Button>
        </Stack>
      </Card>
    </Box>
  );
};

export default AuthScreen;
