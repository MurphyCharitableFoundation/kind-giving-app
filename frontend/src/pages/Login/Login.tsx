import { ChangeEvent, FormEvent, useState } from "react";
import { Box, Button, Card, Container, Typography, Alert, TextField, Divider } from "@mui/material";
import { useNavigate, Link as RouterLink } from "react-router-dom";

import { login } from "../../utils/endpoints/endpoints";

import theme from "../../theme/theme";
import GoogleLoginButton from "../../components/GoogleLoginButton";

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email: string;
  password: string;
}

const Login = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({
    email: "",
    password: "",
  });

  const isDisabled = formData.email.trim() === "" || formData.password.trim() === "";

  // Handle input changes
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    // Optionally, clear error when user starts typing
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  // Validate the form inputs
  const validate = () => {
    const newErrors: FormErrors = {
      email: "",
      password: "",
    };

    let isValid = true;

    // Validate email
    if (!formData.email) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address.";
      isValid = false;
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = "Password is required.";
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleHomeRedirect = () => {
    navigate("/");
  };

  // Handle form submission
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (validate()) {
      // Proceed with form submission (e.g., API call)
      console.log({ email: formData.email, password: formData.password });

      try {
        await login(formData.email, formData.password);
        handleHomeRedirect();
      } catch (error: any) {
        setErrorMessage(error.response?.data?.detail || "Login failed.");
      }
    }
  };

  return (
    <Container sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: '40px',
      px: '24px',
      py: '8px',
      bgcolor: theme.custom.surface.main,
      minHeight: '100vh'
    }}>
      <Typography color={theme.palette.primary.main} variant="headlineXsmallTextMedium">Kind Giving</Typography>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <Typography variant="titleXLargetextMedium" color={theme.custom.surface.onColor}>Welcome back!</Typography>

        <Typography variant="bodyMedium" color={theme.custom.surface.onColorVariant}>New to Kind Giving?
          <Typography component='span' variant="bodyMedium" color={theme.palette.primary.main} onClick={() => navigate("/register")} sx={{ cursor: 'pointer' }}> Create an account</Typography>
        </Typography>
      </Box>
      <Box 
        component="form"
        onSubmit={handleSubmit}
        sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          slotProps={{
            inputLabel: { shrink: true },
          }}
        />
        <TextField
          fullWidth
          label="Password"
          variant="outlined"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          slotProps={{
            inputLabel: { shrink: true },
          }}
        />
        <Typography variant="bodyMedium" color={theme.custom.surface.onColorVariant}>Forgot your password?
          <Typography component='span' variant="bodyMedium" color={theme.palette.primary.main} onClick={() => navigate("/forgot-password")} sx={{ cursor: 'pointer' }}> Reset it</Typography>
        </Typography>
        <Button
          type="submit"
          variant="contained"
          disableElevation={true}
          disabled={isDisabled}
          sx={{
            paddingY: '10px', height: "40px", borderRadius: '40px', textTransform: "none",
          }}
        >
          Log in
        </Button>
        <Divider>
          <Typography variant="bodyMedium" color={theme.custom.surface.onColor}>Or</Typography>
        </Divider>
        <GoogleLoginButton />
      </Box>
    </Container>
  );
};

export default Login;
