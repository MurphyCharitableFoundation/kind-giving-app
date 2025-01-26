import React, { useState, FormEvent, ChangeEvent } from "react";
import { Card, Button, Typography, Container, Alert } from "@mui/material";
import { registerUser } from "../../utils/endpoints";

import EmailInput from "../../components/EmailInput";
import PasswordInput from "../../components/PasswordInput";


interface FormData {
  email: string;
  password1: string;
  password2: string;
}

interface FormErrors {
  email: string;
  password1: string;
  password2: string;
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password1: "",
    password2: ""
  });
  const [errors, setFormErrors] = useState<FormErrors>({
    email: "",
    password1: "",
    password2: ""
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
    if (!formData.password2) {
      newErrors.password2 = "Password is required.";
      isValid = false;
    } else if (formData.password2.length < 8) {
      newErrors.password2 = "Password must be at least 8 characters.";
      isValid = false;
    }

    setFormErrors(newErrors);
    return isValid;
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();

    if (validate()) {
      console.log({ email: formData.email, password1: formData.password1, password2: formData.password2 });
      try {
	
	const response = await registerUser(formData.email, formData.password1, formData.password2);
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
    <Container
      sx={{
        paddingY: 3,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Card
        component={"form"}
        onSubmit={handleRegister}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          minWidth: "200px",
          maxWidth: "400px",
          bgcolor: "#f3f3f3",
          padding: 4,
          borderRadius: "10px",
        }}
      >
	<Typography variant="h3" sx={{ textAlign: "center" }}>
          Register
	</Typography>
	
	  <EmailInput
	    name="email"
            value={formData.email}
            onChange={handleInputChange}
            error={errors.email ? true : false}
            helperText={errors.email}
	  />
	  <PasswordInput
  name="password1"
  label="Password"
  value={formData.password1}
  onChange={handleInputChange}
            error={errors.password1 ? true : false}
            helperText={errors.password1}
          />
	  <PasswordInput
  name="password2"
  label="Confirm Password"
            value={formData.password2}
            onChange={handleInputChange}
            error={errors.password2 ? true : false}
  helperText={errors.password2}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            sign up
          </Button>
	{successMessage && <Alert severity="success">{successMessage}</Alert>}
	{errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      </Card>
    </Container>
  );
};

export default Register;
