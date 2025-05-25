import { Box, Button, TextField, Typography } from "@mui/material";
import { ChangeEvent, MouseEvent, useState } from "react";
import theme from "../../../theme/theme";
import { useNavigate } from "react-router-dom";
import { createNewCause } from "../../../utils/endpoints/causesEndpoints";

interface CreateOrEditCauseProps {
  isCreating?: boolean;
}

interface formData {
  name: string;
  description: string;
}

const CreateOrEditCause = ({ isCreating }: CreateOrEditCauseProps) => {
  const navigate = useNavigate();

  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<formData>({
    name: "",
    description: "",
  });

  const [formErrors, setFormErrors] = useState<formData>({
    name: "",
    description: "",
  });

  // Handle input changes
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    // Optionally, clear error when user starts typing
    setFormErrors({
      ...formErrors,
      [name]: "",
    });
  };

  const validate = () => {
    const inputErrors: formData = {
      name: "",
      description: "",
    };

    let isValid = true;

    // Validate name - Check if we need a more specific validation
    if (!formData.name) {
      inputErrors.name = "Name must be filled.";
      isValid = false;
    } else if (formData.name.length < 2) {
      inputErrors.name = "Name must be valid.";
      isValid = false;
    }

    // Check business rules if we are going to validate description

    setFormErrors(inputErrors);
    return isValid;
  };

  const redirectToCauses = () => {
    navigate("/causes");
  };

  const handleSave = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (validate()) {
      try {
        await createNewCause(formData.name, formData.description);
        redirectToCauses();
      } catch (err: any) {
        setError(err.response?.data?.detail || "Save failed.");
      }
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          padding: "15px",
          paddingBottom: "0",
          gap: "16px",
          alignItems: "center",
          height: "calc(100vh - 127px)",
        }}
      >
        {/* name input */}
        <TextField
          name="name"
          id="name"
          label="Name"
          placeholder="Name"
          value={formData.name}
          onChange={handleInputChange}
          error={formErrors.name ? true : false}
          helperText={formErrors.name}
          sx={{ width: "100%", maxWidth: "400px" }}
        />

        {/* description input */}
        <TextField
          name="description"
          id="description"
          label="Description"
          placeholder="Description"
          value={formData.description}
          onChange={handleInputChange}
          error={formErrors.description ? true : false}
          helperText={formErrors.description}
          multiline
          minRows={1}
          maxRows={10}
          sx={{ width: "100%", maxWidth: "400px" }}
        />

        {/* image outter div */}
        <Box
          component="fieldset"
          sx={{
            border: `1px solid rgba(0, 0, 0, 0.3)`,
            borderRadius: "4px",
            padding: "20px",
            margin: 0,
            "& legend": {
              color: `rgba(0, 0, 0, 0.6)`,
              padding: "0 4px",
              fontSize: "12px",
              marginLeft: "-10px",
            },
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            maxWidth: "400px",
          }}
        >
          <Typography component="legend">Image</Typography>

          <Typography>No file uploaded</Typography>

          <Button
            variant="contained"
            disableElevation
            sx={{
              borderRadius: "40px",
              textTransform: "none",
              paddingY: "10px",
              paddingX: "24px",
              alignItems: "center",
              backgroundColor: theme.palette.secondary.container,
              width: "122px",
              height: "42px",
            }}
          >
            <Typography
              sx={{
                color: theme.palette.secondary.onContainer,
              }}
            >
              Browse
            </Typography>
          </Button>
        </Box>

        {/* error div */}
        {error && (
          <Box
            sx={{
              bgcolor: "red",
              width: "100%",
              maxWidth: "318px",
              padding: "8px",
              borderRadius: "12px",
              color: "white",
              textAlign: "center",
              justifySelf: "center",
            }}
          >
            {error}
          </Box>
        )}
      </Box>

      {/* Cancel and save buttons div */}
      <Box
        sx={{
          padding: "15px",
          width: "100%",
          backgroundColor: theme.custom.surface.main,
          boxShadow: "0px -5px 5px -5px rgba(0,0,0,0.3)",
          display: "flex",
          justifyContent: "space-around",
        }}
      >
        <Button
          variant="contained"
          disableElevation
          onClick={redirectToCauses}
          sx={{
            borderRadius: "40px",
            border: "1px solid rgba(0, 0, 0, 0.6)",
            textTransform: "none",
            paddingY: "10px",
            paddingX: "24px",
            alignItems: "center",
            backgroundColor: theme.custom.surface.main,
            width: "131px",
            height: "47px",
          }}
        >
          <Typography
            sx={{
              color: theme.palette.primary.main,
            }}
          >
            Cancel
          </Typography>
        </Button>

        <Button
          variant="contained"
          disableElevation
          onClick={handleSave}
          sx={{
            borderRadius: "40px",
            textTransform: "none",
            paddingY: "10px",
            paddingX: "24px",
            alignItems: "center",
            width: "131px",
            height: "47px",
          }}
        >
          <Typography
            sx={{
              color: "white",
            }}
          >
            Save
          </Typography>
        </Button>
      </Box>
    </>
  );
};

export default CreateOrEditCause;
