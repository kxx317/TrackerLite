import { React, useState } from "react";
import { Box, TextField, Snackbar, Alert, Fade, Link } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import authApi from "../api/authApi";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(false);
  const [usernameErrText, setUsernameErrText] = useState("");
  const [passwordErrText, setPasswordErrText] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleToastOpen = () => {
    console.log("toast open");
    setToast(true);
  };

  const handleToastClose = () => {
    setToast(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData(e.target);
    const username = data.get("username").trim();
    const password = data.get("password").trim();

    let err = false;
    if (username === "") {
      setUsernameErrText("Username is required");
      err = true;
    }
    if (password === "") {
      setPasswordErrText("Password is required");
      err = true;
    }

    if (err) return;

    setLoading(true);
    try {
      const res = await authApi.login({ username, password });
      setLoading(false);
      localStorage.setItem("token", res.token);
      navigate("/");
    } catch (err) {
      let error = err.data.errors;

      error.forEach((e) => {
        if ((e.param = "username")) {
          setUsernameErrText(e.msg);
        }
        if ((e.param = "password")) {
          setPasswordErrText(e.msg);
        }
      });
      handleToastOpen();
      setLoading(false);
      setUsername("");
      setPassword("");
    }
  };

  return (
    <>
      <Box
        component="form"
        sx={{ mt: 1 }}
        onSubmit={handleSubmit}
        noValidate
        onFocus={() => {
          setUsernameErrText("");
          setPasswordErrText("");
        }}
      >
        <TextField
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          name="username"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          error={usernameErrText !== ""}
          helperText={usernameErrText}
          disabled={loading}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="password"
          label="Password"
          name="password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          error={passwordErrText !== ""}
          helperText={passwordErrText}
          disabled={loading}
        />
        <LoadingButton
          sx={{ mt: 3, mb: 2 }}
          variant="outlined"
          fullWidth
          color="success"
          type="submit"
          loading={loading}
        >
          Login
        </LoadingButton>
        <Box display="flex" justifyContent="space-between">
          <Link href="/" underline="hover">
            Forgot password?
          </Link>
          <Link href="/register" underline="hover">
            Create an account.
          </Link>
        </Box>
      </Box>
      <Snackbar
        open={toast}
        TransitionComponent={Fade}
        autoHideDuration={6000}
        onClose={handleToastClose}
      >
        <Alert
          onClose={handleToastClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          Username or password is incorrect.
        </Alert>
      </Snackbar>
    </>
  );
};

export default Login;
