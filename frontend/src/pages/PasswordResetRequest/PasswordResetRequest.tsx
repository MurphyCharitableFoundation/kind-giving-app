import React, { useState } from "react";
import { TextField, Button, Typography, Box } from "@mui/material";

const PasswordResetRequest: React.FC = () => {
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    try {
      const response = await fetch("http://localhost:8000/api/auth/password/reset/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSuccessMessage("Password reset email sent successfully!");
        setErrorMessage(""); // Clear any error message
        setEmail(""); // Clear the email input
      } else {
        const data = await response.json();
        setErrorMessage(data.detail || "An error occurred. Please try again.");
        setSuccessMessage(""); // Clear any success message
      }
    } catch (error) {
      setErrorMessage("Something went wrong. Please check your connection.");
      setSuccessMessage(""); // Clear any success message
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      padding={2}
    >
      <Typography variant="h4" gutterBottom>
        Reset Your Password
      </Typography>
      <Typography variant="body1" gutterBottom>
        Enter your email address below to receive a password reset link.
      </Typography>
      <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: 400 }}>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Send Reset Link
        </Button>
      </form>
      {successMessage && (
        <Typography variant="body1" color="success.main" marginTop={2}>
          {successMessage}
        </Typography>
      )}
      {errorMessage && (
        <Typography variant="body1" color="error.main" marginTop={2}>
          {errorMessage}
        </Typography>
      )}
    </Box>
  );
};

export default PasswordResetRequest;
