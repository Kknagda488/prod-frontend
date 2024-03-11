import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../context/auth";
import useScriptRef from "../../../../hooks/useScriptRef";
import "react-toastify/dist/ReactToastify.css";

const Login = ({ ...others }) => {
  const theme = useTheme();
  const scriptedRef = useScriptRef();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { storeUserDataInLs } = useAuth();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    if (!validatePassword(password)) {
      setErrors({ password: "Password must be at least 6 characters long" });
      setSubmitting(false);
      return;
    }

    if (!validateEmail(email)) {
      setErrors({ email: "Invalid email address" });
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_PUBLIC_URL}/api/Users/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
            domain: import.meta.env.REACT_APP_DOMAIN,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        if (data.data) {
          storeUserDataInLs(data.data);
          toast.success("Login Successfully");
          navigate("/dashboard");
          setSubmitting(false);
        }
      } else {
        toast.error(data.msg);
        setSubmitting(false);
      }
    } catch (error) {
      console.error("Login error:", error.message);
      setErrors({ submit: error.message });
      setSubmitting(false);
    }
  };

  return (
    <>
      <Grid container direction="column" justifyContent="center" spacing={2}>
        <Grid
          item
          xs={12}
          container
          alignItems="center"
          justifyContent="center"
        >
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">
              Sign in with Email address
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <form noValidate onSubmit={handleSubmit} {...others}>
        <FormControl
          fullWidth
          error={Boolean(errors.email)}
          sx={{ ...theme.typography.customInput }}
        >
          <InputLabel htmlFor="outlined-adornment-email-login">
            Email Address / Username
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-email-login"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="Email Address / Username"
            inputProps={{}}
          />
          {errors.email && (
            <FormHelperText error id="standard-weight-helper-text-email-login">
              {errors.email}
            </FormHelperText>
          )}
        </FormControl>

        <FormControl
          fullWidth
          error={Boolean(errors.password)}
          sx={{ ...theme.typography.customInput }}
        >
          <InputLabel htmlFor="outlined-adornment-password-login">
            Password
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-password-login"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                  size="large"
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
            inputProps={{}}
          />
          {errors.password && (
            <FormHelperText
              error
              id="standard-weight-helper-text-password-login"
            >
              {errors.password}
            </FormHelperText>
          )}
        </FormControl>
        {errors.submit && (
          <Box sx={{ mt: 3 }}>
            <FormHelperText error>{errors.submit}</FormHelperText>
          </Box>
        )}

        <Box sx={{ mt: 2 }}>
          <Button
            disableElevation
            fullWidth
            size="large"
            type="submit"
            style={{
              backgroundColor: theme.palette.secondary.main,
              color: theme.palette.info.contrastText,
            }}
          >
            Log in
          </Button>
        </Box>
      </form>
    </>
  );
};

export default Login;
