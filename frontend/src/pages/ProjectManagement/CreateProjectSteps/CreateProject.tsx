import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepReview from "./StepReview";
import { MultiStepForm } from "../../../components/MultiStepForm";
import { StepConfig } from "../../../components/MultiStepForm";
import { Box, Container, IconButton, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import theme from "../../../theme/theme";
import { CreateProjectFormData } from "./CreateProjectFormData";
import { createProject } from "../../../utils/projectsEndpoints";

const steps: StepConfig<CreateProjectFormData>[] = [
  { label: "Step One", component: StepOne },
  { label: "Step Two", component: StepTwo },
  { label: "Review", component: StepReview },
];

export default function CreateProject() {

  const initialCreateProjectFormData: CreateProjectFormData = {
    name: "",
    img: "default",
    causes: [],
    target: 0,
    campaign_limit: 0,
    city: "",
    country: "",
    description: "",
    status: "draft",
  };

  const handleSubmit = async (data: CreateProjectFormData) => {
    try {
      await createProject(data);

      // TODO -> redirect, toast or reset form
      console.log("Project created successfully");
    } catch (error) {
      console.error("Failed to create project:", error);
    }
  };

  return (
    <Container sx={{ padding: 0, bgcolor: theme.custom.misc.background }}>

      {/* TODO -> This box should be a reusable component */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          paddingY: "18px",
          paddingLeft: "16px",
          paddingRight: "8px",
          alignItems: "center",
          bgcolor: theme.custom.misc.background,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: "8px",
            alignItems: "center",
          }}
        >
          <IconButton
            aria-label="navigate back to projects"
            sx={{ padding: 0, display: "flex", alignItems: "center" }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="titleXLargetextMedium">
            Create Project
          </Typography>
        </Box>
      </Box>
      <MultiStepForm
        steps={steps}
        initialData={initialCreateProjectFormData}
        onSubmit={handleSubmit}
      />
    </Container>
  );
}