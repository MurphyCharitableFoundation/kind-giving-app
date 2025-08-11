import React, { useState, ChangeEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Container, Button, Typography, Alert, Box, TextField } from "@mui/material";

import PasswordInput from "../../components/PasswordInput";

import { resetPasswordConfirm } from "../../utils/endpoints/endpoints";
import theme from "../../theme/theme";

interface FormData {
  new_password1: string;
  new_password2: string;
}

interface FormErrors {
  new_password1: string;
  new_password2: string;
}

const PasswordResetConfirm: React.FC = () => {
  const { uid, token } = useParams<{ uid: string; token: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    new_password1: "",
    new_password2: "",
  });
  const [errors, setFormErrors] = useState<FormErrors>({
    new_password1: "",
    new_password2: "",
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const isDisabled = formData.new_password1.trim() === "" || formData.new_password2.trim() === "";

  const handleLoginRedirect = () => {
    navigate("/login");
  };

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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await resetPasswordConfirm(
        uid,
        token,
        formData.new_password1,
        formData.new_password2
      );
      setSuccessMessage("Your password has been reset successfully!");
      handleLoginRedirect();
    } catch (error: any) {
      setFormErrors({
        ...errors,
        ...error.response?.data,
      });
      setSuccessMessage("");
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
        <Typography variant="titleXLargetextMedium" color={theme.custom.surface.onColor}>Password reset</Typography>
        <Typography variant="bodyMedium" color={theme.custom.surface.onColorVariant}>
          Make sure your new password includes: <br/>
          At least 8 characters <br/>
          At least 1 uppercase letter (A-Z) <br/>
          At least 1 lowercase letter (a-z) <br/>
          At least 1 number (0-9) <br/>
          At least 1 special character (e.g., !@#$%^&*)
        </Typography>
      </Box>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        <TextField
          fullWidth
          label="New password"
          variant="outlined"
          type="password"
          name="new_password1"
          value={formData.new_password1}
          onChange={handleInputChange}
          slotProps={{
            inputLabel: { shrink: true },
          }}
        />
        <TextField
          fullWidth
          label="Confirm new password"
          variant="outlined"
          type="password"
          name="new_password2"
          value={formData.new_password2}
          onChange={handleInputChange}
          slotProps={{
            inputLabel: { shrink: true },
          }}
        />
        <Button
          variant="contained"
          disableElevation={true}
          disabled={isDisabled}
          sx={{
            paddingY: '10px', height: "40px", borderRadius: '40px', textTransform: "none",
          }}
        >
          Update password
        </Button>
      </Box>
    </Container>
  );
};

export default PasswordResetConfirm;
