import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';


const EmailConfirm: React.FC = () => {
  const { key } = useParams<{ key: string }>(); 
  const [status, setStatus] = useState<string>("Verifying your email...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyEmail = async () => {
      if (!key) {
        setError("Invalid verification key.");
        setStatus("");
        return;
      }

      try {
        const response = await fetch("http://localhost:8000/api/auth/register/verify-email/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ key }), 
        });

        if (response.ok) {
          setStatus("Your email has been successfully verified!");
        } else {
          const data = await response.json();
          setError(data.detail || "Verification failed. Please try again.");
        }
      } catch (err) {
        setError("An error occurred while verifying your email. Please try again later.");
      }
    };

    verifyEmail();
  }, [key]);

  return (
    <Box sx={{ width: "100%", maxWidth: 500 }}>
      <Typography variant="h4" gutterBottom>Email Confirmation</Typography>
      <Typography  variant="caption" gutterBottom>{status && <p style={{ color: "green" }}>{status}</p>}</Typography>
      <Typography  variant="caption" gutterBottom>{error && <p style={{ color: "red" }}>{error}</p>}</Typography>
    </Box>
  );
};

export default EmailConfirm;

