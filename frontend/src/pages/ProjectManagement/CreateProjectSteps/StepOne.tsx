import React, { useEffect, useState } from "react";
import { StepProps } from "../../../components/MultiStepForm";
import { Box, Button, Chip, Container, FormControl, InputAdornment, InputLabel, OutlinedInput, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import NewItemButton from "../../../components/NewItemButton/NewItemButton";
import theme from "../../../theme/theme";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { CreateProjectFormData } from "./CreateProjectFormData";
import { TagsModal } from "./TagsModal";
import Cause from "../../../interfaces/Cause";
import { getCauses } from "../../../utils/endpoints/causesEndpoints";

interface PersonalFormData {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
}

const StepOne: React.FC<StepProps<CreateProjectFormData>> = ({
  data,
  onChange,
}) => {
  const [causes, setCauses] = useState<Cause[]>([]);
  const [tagsModalOpen, setTagsModalOpen] = useState(false);

  const selectedCauseIds = data.causes.map(cause => cause.id);

  const selectedCauses = causes.filter((cause) =>
    selectedCauseIds.includes(cause.id)
  );

  useEffect(() => {
    getCauses()
      .then((result) => {
        console.log(result);
        setCauses(result);
      })
      .catch((err) => console.error("Failed to fetch causes: ", err))
  }, [])

  const handleSaveCauses = (ids: number[]) => {
    const selectedCauses = causes.filter(cause =>
      ids.includes(cause.id)
    );

    onChange("causes", selectedCauses);
  };

  return (
    <Container sx={{ padding: 0 }}>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          alignItems: 'start'
        }}
      >
        <FormControl fullWidth>
          <InputLabel htmlFor="title">Title</InputLabel>
          <OutlinedInput
            id="title"
            startAdornment
            label="Title"
            value={data.name}
            onChange={(e) => onChange('name', e.target.value)}
          />
        </FormControl>

        <FormControl fullWidth>
          <InputLabel htmlFor="description">Description</InputLabel>
          <OutlinedInput
            id="description"
            startAdornment
            label="Description"
            value={data.description}
            onChange={(e) => onChange('description', e.target.value)}
          />
        </FormControl>

        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {selectedCauses.map((cause) => (
            <Chip key={cause.id} label={cause.name} />
          ))}
        </Box>

        <Box>
          <NewItemButton onClick={() => setTagsModalOpen(true)}>Add Causes</NewItemButton>
        </Box>

        <TagsModal
          open={tagsModalOpen}
          onClose={() => setTagsModalOpen(false)}
          value={selectedCauseIds}
          onSave={handleSaveCauses}
          causes={causes}
        />

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: '8px'
          }}
        >
          <ToggleButtonGroup
            value={data.status}
            exclusive
            onChange={(_, value) => {
              if (value !== null) {
                onChange("status", value);
              }
            }}
            sx={{
              borderRadius: "40px",
              backgroundColor: theme.custom.surface.main,
              border: `1px solid ${theme.custom.misc.outline}`,
              overflow: "hidden",

              "& .MuiToggleButton-root": {
                border: "none",
                textTransform: "none",
                px: 3,
                py: 1.5,
                transition: "background-color 250ms ease, color 200ms ease",
              },
            }}
          >
            <ToggleButton
              value="active"
              sx={{
                "&.Mui-selected": {
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.onColor,
                },
                "&.Mui-selected:hover": {
                  backgroundColor: theme.palette.primary.main,
                },
              }}
            >
              <VisibilityIcon sx={{ mr: 1 }} />
              Active
            </ToggleButton>

            <ToggleButton
              value="draft"
              sx={{
                "&.Mui-selected": {
                  backgroundColor: theme.status.warning.main,
                  color: theme.palette.primary.onColor,
                },
                "&.Mui-selected:hover": {
                  backgroundColor: theme.status.warning.main,
                },
              }}
            >
              <VisibilityOffIcon sx={{ mr: 1 }} />
              Inactive
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

      </Box>

    </Container>
  );
};

export default StepOne;
