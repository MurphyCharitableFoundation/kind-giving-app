import { Box, Button, Card, Container, Typography } from "@mui/material";
import EmailInput from "../../components/EmailInput";
import { ChangeEvent, FormEvent, useState } from "react";

interface FormData {
  email: string;
}

const ForgotPassword = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
  });

  const [errors, setErrors] = useState<FormData>({
    email: "",
  });

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
      newErrors.email = "Invalid email address.";
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
      console.log({ email: formData.email });

      // Optionally reset form fields
      // setValues({ email: "");
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            textAlign: "center",
            gap: 3,
          }}
        >
          <Typography variant="h4">Forgot Password?</Typography>

          <Typography variant="body1" component={"p"}>
            Enter your email address and we will send you instructions to reset
            your password.
          </Typography>
        </Box>

        <EmailInput
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          error={errors.email ? true : false}
          helperText={errors.email}
        />

        <Button type="submit" variant="contained">
          Continue
        </Button>
      </Card>
    </Container>
  );
};

export default ForgotPassword;
