import { React, useState } from "react";
import { Box, TextField, Snackbar, Alert, Fade, Link } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import authApi from "../api/authApi";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [usernameErrText, setUsernameErrText] = useState("");
  const [passwordErrText, setPasswordErrText] = useState("");
  const [confirmPasswordErrText, setConfirmPasswordErrText] = useState("");

  const resetErrText = () => {
    setUsernameErrText("");
    setPasswordErrText("");
    setConfirmPasswordErrText("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetErrText();

    const data = new FormData(e.target);
    const username = data.get("username").trim();
    const password = data.get("password").trim();
    const confirmPassword = data.get("confirmPassword").trim();

    let err = false;
    if (username === "") {
      setUsernameErrText("Username is required");
      err = true;
    }
    if (password === "") {
      setPasswordErrText("Password is required");
      err = true;
    }

    if (confirmPassword === "") {
      setConfirmPasswordErrText("Confirm Password is required");
      err = true;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordErrText("Password does not match");
      err = true;
    }

    if (err) return;

    setLoading(true);

    try {
      const res = await authApi.register({
        username,
        password,
        confirmPassword,
      });
      setLoading(false);
      localStorage.setItem("token", res.token);
      navigate("/");
    } catch (err) {
      err.data.errors.forEach((e) => {
        if (e.param === "username") {
          setUsernameErrText(e.msg);
        } else if (e.param === "password") {
          setPasswordErrText(e.msg);
        } else if (e.param === "confirmPassword") {
          setConfirmPasswordErrText(e.msg);
        }
      });
    }
    setLoading(false);
  };

  return (
    <>
      <Box
        component="form"
        sx={{ mt: 1 }}
        onSubmit={handleSubmit}
        noValidate
        onFocus={resetErrText}
      >
        <TextField
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          name="username"
          disabled={loading}
          error={usernameErrText !== ""}
          helperText={usernameErrText}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="password"
          label="Password"
          name="password"
          type="password"
          disabled={loading}
          error={passwordErrText !== ""}
          helperText={passwordErrText}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="confirmPassword"
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          disabled={loading}
          error={confirmPasswordErrText !== ""}
          helperText={confirmPasswordErrText}
        />
        <LoadingButton
          sx={{ mt: 3, mb: 2 }}
          variant="outlined"
          fullWidth
          color="success"
          type="submit"
          loading={loading}
        >
          Register
        </LoadingButton>
        <Box display="flex" justifyContent="space-between">
          <Link href="/login" underline="hover">
            Already have an account? Login here.
          </Link>
        </Box>
      </Box>
    </>
  );
};

export default Register;
