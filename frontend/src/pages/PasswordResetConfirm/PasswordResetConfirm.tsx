import React, { useState, ChangeEvent, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Container, Button, Typography, Alert, Box, TextField, Modal } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
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
  const { token } = useParams<{ token: string }>();
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
  const [modalOpen, setModalOpen] = useState(false);

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

  const validate = () => {
    const newErrors: FormErrors = { new_password1: "", new_password2: "" };
    let isValid = true;

    if (!formData.new_password1) {
      newErrors.new_password1 = "Password is required.";
      isValid = false;
    } else if (formData.new_password1.length < 8) {
      newErrors.new_password1 = "Password must be at least 8 characters.";
      isValid = false;
    }

    if (formData.new_password1 !== formData.new_password2) {
      newErrors.new_password2 = "Passwords do not match.";
      isValid = false;
    }

    setFormErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) { return; }
    if (!token) { return; }
    try {
      await resetPasswordConfirm(
        token,
        formData.new_password1,
        formData.new_password2
      );
      setSuccessMessage("Your password has been updated. You can now log in using your new password.");
      setModalOpen(true);
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
          Make sure your new password includes: <br />
          At least 8 characters <br />
          At least 1 uppercase letter (A-Z) <br />
          At least 1 lowercase letter (a-z) <br />
          At least 1 number (0-9) <br />
          At least 1 special character (e.g., !@#$%^&*)
        </Typography>
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
          label="New password"
          variant="outlined"
          type="password"
          name="new_password1"
          value={formData.new_password1}
          onChange={handleInputChange}
          slotProps={{
            inputLabel: { shrink: true },
          }}
          error={Boolean(errors.new_password1)}
          helperText={errors.new_password1 || " "}
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
          error={Boolean(errors.new_password2)}
          helperText={errors.new_password2 || " "}
        />
        <Button
          type="submit"
          variant="contained"
          disableElevation={true}
          disabled={isDisabled}
          sx={{
            paddingY: '10px', height: "40px", borderRadius: '40px', textTransform: "none",
          }}
        >
          Update password
        </Button>
        <Modal open={modalOpen} disableEscapeKeyDown onClose={() => { }}>
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', bgcolor: theme.custom.surface.main, p: '24px', borderRadius: '28px', boxShadow: theme.shadows[10] }}>
              <CheckCircleIcon sx={{ color: theme.status.success.main, width: '40px', height: '40px' }} />
              <Typography align="center">{successMessage}</Typography>
              <Button
                variant="contained"
                disableElevation
                onClick={handleLoginRedirect}
                sx={{
                  paddingY: '10px',
                  height: '40px',
                  borderRadius: '40px',
                  textTransform: 'none',
                  alignSelf: 'center',
                  width: '100%'
                }}
              >
                <Typography color={theme.palette.primary.onColor} variant='labelLarge'>Go to Log in</Typography>
              </Button>
            </Box>
          </Box>
        </Modal>
      </Box>
    </Container>
  );
};

export default PasswordResetConfirm;
