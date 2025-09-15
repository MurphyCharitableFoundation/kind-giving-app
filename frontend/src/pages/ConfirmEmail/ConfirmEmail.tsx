import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Container, Typography } from "@mui/material";
import { confirmEmail } from "../../utils/endpoints/endpoints";
import theme from "../../theme/theme";

const EmailConfirm: React.FC = () => {
  const { key } = useParams<{ key: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<string>("Verifying your email...");
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(5);

  useEffect(() => {
    const verifyEmail = async () => {
      if (!key) {
        setError("Invalid verification key.");
        setStatus("");
        return;
      }

      try {
        await confirmEmail(key);
        setStatus("Your email has been successfully verified!");
      } catch (err: any) {
        let message = "An error occurred during verification.";

        if (err.response?.data?.detail) {
          message = err.response.data.detail;
        } else if (err.message) {
          message = err.message;
        } else if (typeof err === "string") {
          message = err;
        }
        setError(message);
        setStatus("");
      }
    };

    verifyEmail();
  }, [key, navigate]);

  useEffect(() => {
    if (status === "Your email has been successfully verified!") {
      if (countdown === 0) {
        navigate("/");
        return;
      }

      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [countdown, status, navigate]);

  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '40px',
        px: '24px',
        py: '8px',
        bgcolor: theme.custom.surface.main,
        minHeight: '100vh'
      }}
    >
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          minWidth: "200px",
          maxWidth: "400px",
          bgcolor: theme.custom.inverseSurface,
          padding: 4,
          borderRadius: "10px",
          alignItems: "center",
          boxShadow: theme.shadows[5]
        }}
      >
        <Typography variant="displaySmall" sx={{ textAlign: "center" }}>
          Email Confirmation
        </Typography>
        <Typography
          variant="bodyXLarge"
          gutterBottom
          sx={{
            color:
              status === "Verifying your email..."
                ? theme.status.warning.main
                : status === "Your email has been successfully verified!"
                  ? theme.status.success.main
                  : theme.palette.primary.main,
          }}
        >
          {status}
        </Typography>
        {status === "Your email has been successfully verified!" && (
          <Typography variant="bodyLarge" gutterBottom sx={{ color: theme.palette.primary.main }}>
            Redirecting in {countdown} second{countdown !== 1 ? "s" : ""}...
          </Typography>
        )}
        <Typography variant="bodyXLarge" gutterBottom>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </Typography>
      </Card>
    </Container>
  );
};

export default EmailConfirm;
