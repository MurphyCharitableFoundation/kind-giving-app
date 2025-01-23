import { ChangeEvent, FormEvent, useState } from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import EmailInput from "../../components/EmailInput";
import PasswordInput from "../../components/PasswordInput";

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email: string;
  password: string;
}

const Login = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({
    email: "",
    password: "",
  });

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

    validate();
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

  // Handle form submission
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (validate()) {
      // Proceed with form submission (e.g., API call)
      console.log({ email: formData.email, password: formData.password });

      // Optionally reset form fields
      // setValues({ email: "", password: "" });
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
      <Box
        component={"form"}
        onSubmit={handleSubmit}
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
          Login
        </Typography>

        <EmailInput
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          error={errors.email ? true : false}
          helperText={errors.email}
        />

        <PasswordInput
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          error={errors.password ? true : false}
          helperText={errors.password}
        />

        <Typography
          sx={{
            textDecoration: "underline",
            textAlign: "end",
          }}
        >
          <RouterLink to="/forgot-password">Forgot Password?</RouterLink>
        </Typography>

        <Button type="submit" variant="contained">
          Login
        </Button>

        <Typography variant="body1" sx={{ textAlign: "end" }}>
          Don't have an account?{" "}
          <Box component={"span"} sx={{ textDecoration: "underline" }}>
            <RouterLink to="/signup">Sign Up Here</RouterLink>
          </Box>
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;
