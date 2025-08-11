import React, { useState, FormEvent, ChangeEvent } from "react";
import { Card, Button, Typography, Container, Alert, Box, TextField, Divider, Checkbox } from "@mui/material";
import { registerUser } from "../../utils/endpoints/endpoints";

import EmailInput from "../../components/EmailInput";
import PasswordInput from "../../components/PasswordInput";
import GoogleLoginButton from "../../components/GoogleLoginButton";
import LogoutButton from "../../components/LogoutButton";
import theme from "../../theme/theme";
import { useNavigate } from "react-router-dom";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password1: string;
  password2: string;
}

interface FormErrors {
  firstName: string;
  lastName: string;
  email: string;
  password1: string;
  password2: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password1: "",
    password2: "",
  });
  const [errors, setFormErrors] = useState<FormErrors>({
    firstName: "",
    lastName: "",
    email: "",
    password1: "",
    password2: ""
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isDisabled = formData.email.trim() === "" || formData.password1.trim() === "";

  // Handle input changes
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    // Optionally, clear error when user starts typing
    setFormErrors({
      ...errors,
      [name]: "",
    });
  };

  const validate = () => {
    const newErrors: FormErrors = {
      email: "",
      password1: "",
      password2: "",
      firstName: "",
      lastName: ""
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

    // Validate password1
    if (!formData.password1) {
      newErrors.password1 = "Password is required.";
      isValid = false;
    } else if (formData.password1.length < 8) {
      newErrors.password1 = "Password must be at least 8 characters.";
      isValid = false;
    }

    // Validate password2
    if (formData.password1 != formData.password2) {
      newErrors.password2 = "Passwords must match.";
      isValid = false;
    }

    setFormErrors(newErrors);
    return isValid;
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();

    if (validate()) {
      console.log({
        email: formData.email,
        password: formData.password1,
      });
      try {
        //todo -> modify this function to accept the new props
        const response = await registerUser(
          formData.email,
          formData.password1,
          formData.password2,
        );
        setSuccessMessage(response.detail);
        setErrorMessage(null);
      } catch (error: any) {
        setFormErrors({
          ...errors,
          ...error.response?.data,
        });
        setSuccessMessage(null);
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
        <Typography variant="titleXLargetextMedium" color={theme.custom.surface.onColor}>Create an account</Typography>

        <Typography variant="bodyMedium" color={theme.custom.surface.onColorVariant}>Already a member?
          <Typography component='span' variant="bodyMedium" color={theme.palette.primary.main} onClick={() => navigate("/login")} sx={{ cursor: 'pointer' }}> Log in</Typography>
        </Typography>
      </Box>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        <TextField
          fullWidth
          label="First Name"
          variant="outlined"
          name="firstName"
          value={formData.email}
          onChange={handleInputChange}
          slotProps={{
            inputLabel: { shrink: true },
          }}
        />
        <TextField
          fullWidth
          label="Last Name"
          variant="outlined"
          name="lastName"
          value={formData.email}
          onChange={handleInputChange}
          slotProps={{
            inputLabel: { shrink: true },
          }}
        />
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
          name="password1"
          value={formData.password1}
          onChange={handleInputChange}
          slotProps={{
            inputLabel: { shrink: true },
          }}
        />
        <TextField
          fullWidth
          label="Confirm password"
          variant="outlined"
          type="password"
          name="password2"
          value={formData.password2}
          onChange={handleInputChange}
          slotProps={{
            inputLabel: { shrink: true },
          }}
        />
        <Box sx={{display: 'flex', flexDirection: 'row', padding: '15px', gap: '25px', alignItems: 'center'}}>
          <Checkbox />
          <Typography variant="bodySmall" color={theme.custom.surface.onColorVariant}>I agree to Kind Loans’ Terms and Conditions.</Typography>
        </Box>
        <Button
          variant="contained"
          disableElevation={true}
          disabled={isDisabled}
          sx={{
            paddingY: '10px', height: "40px", borderRadius: '40px', textTransform: "none",
          }}
        >
          Create account
        </Button>
        <Divider>
          <Typography variant="bodyMedium" color={theme.custom.surface.onColor}>Or</Typography>
        </Divider>
        <GoogleLoginButton />
      </Box>
    </Container>
  );
};

export default Register;
