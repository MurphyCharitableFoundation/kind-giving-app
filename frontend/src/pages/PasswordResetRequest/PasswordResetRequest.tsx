import { Box, Button, Card, Container, Typography, Alert, TextField } from "@mui/material";
import EmailInput from "../../components/EmailInput";
import { ChangeEvent, FormEvent, useState } from "react";

import { resetPasswordRequest } from "../../utils/endpoints/endpoints";
import theme from "../../theme/theme";
import { useNavigate } from "react-router-dom";

interface FormData {
  email: string;
}

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    email: "",
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormData>({
    email: "",
  });
  const isDisabled = formData.email.trim() === ""

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
  };

  //Validate the input
  const validate = () => {
    const newErrors: FormData = {
      email: "",
    };

    let isValid = true;

    if (!formData.email) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address format.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (validate()) {
      try {
        const { detail } = await resetPasswordRequest(formData.email);
        //setFormData({ email: "" });
        setSuccessMessage(detail);
        navigate('/forgot-password/verification-code', {state: {email: formData.email}})
      } catch (err: any) {
        setSuccessMessage("");
      }
    }
  };

  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '40px',
        px: '24px',
        py: '8px',
        bgcolor: theme.custom.surface.main,
        minHeight: '100vh'
      }}
    >
      <Typography color={theme.palette.primary.main} variant="headlineXsmallTextMedium">Kind Giving</Typography>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <Typography variant="titleXLargetextMedium" color={theme.custom.surface.onColor}>Password request</Typography>

        <Typography variant="bodyMedium" color={theme.custom.surface.onColorVariant}>Enter your email address, and we’ll send you a verification code to reset your password.</Typography>
      </Box>
      <Box
        component='form'
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
          error={Boolean(errors.email)}
          helperText={errors.email || " "}
        />
        <Button
          variant="contained"
          disableElevation
          disabled={isDisabled}
          type="submit"
          sx={{
            paddingY: '10px',
            height: '40px',
            borderRadius: '40px',
            textTransform: 'none',
          }}
        >
          Send verification code
        </Button>
      </Box>
    </Container>
  );
};

export default ForgotPassword;
