import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useEffect, useState } from "react";
import theme from "../../theme/theme";
import SaveIcon from "@mui/icons-material/Save";
import OutlinedFormContainer from "../../components/OutlinedFormContainer";
import ProjectImagesCarousel from "../../components/ProjectImagesCarousel";
import CausesInput from "../../components/CausesInput";
import {
  fetchProjectBeneficiaries,
  fetchProjectById,
  fetchProjectCampaigns,
  normalizeCauses,
  Project,
  ProjectBeneficiary,
  ProjectCampaign,
  updateProject,
} from "../../utils/projectsEndpoints";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import BeneficiaryCard from "./components/BeneficiaryCard";
import CampaignCard from "./components/CampaignCard";

interface ProjectFormData {
  causes: string[];
  title: string;
  description: string;
  status: string;
}

const ProjectDetails: React.FC = () => {
  const navigate = useNavigate();
  const projectId = Number(useParams().projectId);
  const [project, setProject] = useState<Project | null>(null);
  const [originalData, setOriginalData] = useState<ProjectFormData | null>(
    null
  );
  const [editableData, setEditableData] = useState<ProjectFormData | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const handleEditClick = () => setIsEditing(true);
  const [beneficiaries, setBeneficiaries] = useState<ProjectBeneficiary[]>([]);
  const [campaigns, setCampaigns] = useState<ProjectCampaign[]>([]);

  useEffect(() => {
    fetchProjectCampaigns(projectId).then((campaigns) => {
      setCampaigns(campaigns);
      console.log("setCampaigns: ", campaigns);
    });
    fetchProjectBeneficiaries(projectId).then((beneficiaries) => {
      setBeneficiaries(beneficiaries);
      console.log("setBeneficiaries: ", beneficiaries);
    });
    fetchProjectById(projectId)
      .then((project) => {
        setProject(project);
        const formattedData = {
          causes: normalizeCauses(project.causes),
          title: project.name,
          description: project.description,
          status: project.status,
        };
        setOriginalData(formattedData);
        setEditableData(formattedData);
      })
      .finally(() => setIsLoading(false));
  }, [projectId]);

  const handleCancelClick = () => {
    if (originalData) setEditableData(originalData);
    setIsEditing(false);
  };

  const handleSaveClick = async () => {
    if (!editableData) return;
    try {
      const patchData = {
        name: editableData.title,
        causes_names: editableData.causes,
        description: editableData.description,
        status: editableData.status,
      };
      console.log("Request payload:", JSON.stringify(patchData));
      const updatedProject = await updateProject(projectId, patchData);
      setProject(updatedProject);
      setOriginalData({
        causes: normalizeCauses(updatedProject.causes),
        title: updatedProject.name,
        description: updatedProject.description,
        status: updatedProject.status,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update project:", error);
    }
  };

  const handleChange = (
    field: keyof ProjectFormData,
    value: string | string[]
  ) => {
    setEditableData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [field]: value,
      };
    });
  };

  if (!project && !isLoading) {
    {
      /* Redirecting to 404 page if project, for some reason, is not founded. */
    }
    return <Navigate to="*" replace />;
  }

  return (
    <Container sx={{ padding: 0 }}>
      {/* Header */}
      <Navbar>Projects</Navbar>
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
            onClick={() => navigate("/projects")}
            sx={{ padding: 0, display: "flex", alignItems: "center" }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="titleXLargetextMedium">
            Project details
          </Typography>
        </Box>
        {!isEditing && (
          <Box sx={{ display: "flex", flexDirection: "row", gap: "4px" }}>
            <Avatar
              sx={{
                bgcolor: theme.palette.secondary.container,
                cursor: "pointer",
              }}
              onClick={handleEditClick}
            >
              {isEditing ? (
                <SaveIcon sx={{ color: theme.custom.surface.onColorVariant }} />
              ) : (
                <EditIcon sx={{ color: theme.custom.surface.onColorVariant }} />
              )}
            </Avatar>
            <Avatar sx={{ bgcolor: theme.palette.secondary.container }}>
              <DeleteIcon sx={{ color: theme.custom.surface.onColorVariant }} />
            </Avatar>
          </Box>
        )}
      </Box>
      {/* Project details container */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          marginTop: "10px",
          padding: "15px",
          bgcolor: isEditing ? "white" : theme.custom.misc.background,
        }}
      >
        <CausesInput
          isEditing={isEditing}
          causes={editableData?.causes || []} // Provide fallback empty array
          onCausesChange={(newCauses) => {
            if (editableData) {
              handleChange("causes", newCauses);
            }
          }}
        />
        {/* Title */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {!isEditing && (
            <Typography
              color={theme.palette.primary.main}
              variant="titleXSmalltextMedium"
            >
              Title
            </Typography>
          )}
          {isEditing ? (
            <TextField
              fullWidth
              variant="outlined"
              label="Title"
              value={editableData?.title}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          ) : (
            <Typography
              color={theme.custom.surface.onColor}
              variant="bodySmall"
            >
              {editableData?.title}
            </Typography>
          )}
        </Box>
        {/* Description */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {!isEditing && (
            <Typography
              color={theme.palette.primary.main}
              variant="titleXSmalltextMedium"
            >
              Description
            </Typography>
          )}
          {isEditing ? (
            <TextField
              fullWidth
              multiline
              label="Description"
              variant="outlined"
              value={editableData?.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          ) : (
            <Typography
              color={theme.custom.surface.onColor}
              variant="bodySmall"
            >
              {editableData?.description}
            </Typography>
          )}
        </Box>
        {/* Images Carousel */}
        {!isEditing && (
          <>
            <Typography
              color={theme.palette.primary.main}
              variant="titleXSmalltextMedium"
            >
              Images
            </Typography>
            <ProjectImagesCarousel />
          </>
        )}
        {/* Project details */}
        {/* Status */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {isEditing ? (
            <OutlinedFormContainer label="Status">
              <RadioGroup
                value={editableData?.status || ""}
                row={true}
                sx={{ paddingLeft: "28px", gap: "20px" }}
                onChange={(e) => {
                  handleChange("status", e.target.value);
                }}
              >
                <FormControlLabel
                  value="active"
                  control={<Radio />}
                  label="Active"
                />
                <FormControlLabel
                  value="draft"
                  control={<Radio />}
                  label="Draft"
                />
              </RadioGroup>
            </OutlinedFormContainer>
          ) : (
            <>
              <Typography
                color={theme.palette.primary.main}
                variant="titleXSmalltextMedium"
              >
                Status
              </Typography>
              <Typography
                color={theme.custom.surface.onColor}
                variant="bodySmall"
              >
                {editableData?.status}
              </Typography>
            </>
          )}
        </Box>
        {/* Start and end date */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              alignItems: "start",
            }}
          >
            <Typography
              color={theme.palette.primary.main}
              variant="titleXSmalltextMedium"
            >
              Start
            </Typography>
            <Typography
              color={theme.custom.surface.onColor}
              variant="bodySmall"
            >
              19/19/2022
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              alignItems: "start",
            }}
          >
            <Typography
              color={theme.palette.primary.main}
              variant="titleXSmalltextMedium"
            >
              End
            </Typography>
            <Typography
              color={theme.custom.surface.onColor}
              variant="bodySmall"
            >
              19/19/2292
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              alignItems: "start",
            }}
          >
            <Typography
              color={theme.palette.primary.main}
              variant="titleXSmalltextMedium"
            >
              Target
            </Typography>
            <Typography
              color={theme.custom.surface.onColor}
              variant="bodySmall"
            >
              ${project?.target}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              alignItems: "start",
            }}
          >
            <Typography
              color={theme.palette.primary.main}
              variant="titleXSmalltextMedium"
            >
              Achieved
            </Typography>
            <Typography
              color={theme.custom.surface.onColor}
              variant="bodySmall"
            >
              $444
            </Typography>
          </Box>
        </Box>
        {/* Beneficiaries list */}
        {!isEditing && (
          <>
            <Divider />
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography
                color={theme.custom.surface.onColor}
                variant="titleXLargetextMedium"
              >
                Beneficiaries
              </Typography>
              <Stack
                direction="column"
                spacing="7px"
                sx={{ marginTop: "17px" }}
              >
                {beneficiaries.length === 0 ? (
                  <Typography
                    color={theme.custom.surface.onColorVariant}
                    variant="titleMediumtextMedium"
                  >
                    No beneficiaries for this project.
                  </Typography>
                ) : (
                  <>
                    {beneficiaries.map((beneficiary) => (
                      <BeneficiaryCard
                        key={`${beneficiary.assignable_type}-${beneficiary.assignable_id}`}
                        assignment={beneficiary}
                      />
                    ))}
                    <Button
                      variant="contained"
                      disableElevation
                      sx={{
                        bgcolor: theme.custom.surfaceContainer.lowest,
                        border: 1,
                        borderColor: theme.custom.misc.outline,
                        borderRadius: "20px",
                        textTransform: "none",
                      }}
                    >
                      <Typography color={theme.palette.primary.main}>
                        View all
                      </Typography>
                    </Button>
                  </>
                )}
              </Stack>
            </Box>
            <Divider />
          </>
        )}
        {/* Campaigns list */}
        {!isEditing && (
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography
              color={theme.custom.surface.onColor}
              variant="titleXLargetextMedium"
            >
              Campaigns
            </Typography>
            <Stack direction="column" spacing="7px" sx={{ marginTop: "17px" }}>
              {campaigns.length === 0 ? (
                <Typography
                  color={theme.custom.surface.onColorVariant}
                  variant="titleMediumtextMedium"
                >
                  No campaigns for this project.
                </Typography>
              ) : (
                <>
                  {campaigns.map((campaign) => (
                    <CampaignCard key={campaign.id} campaign={campaign} />
                  ))}
                  <Button
                    variant="contained"
                    disableElevation
                    sx={{
                      bgcolor: theme.custom.surfaceContainer.lowest,
                      border: 1,
                      borderColor: theme.custom.misc.outline,
                      borderRadius: "20px",
                      textTransform: "none",
                    }}
                  >
                    <Typography color={theme.palette.primary.main}>
                      View all
                    </Typography>
                  </Button>
                </>
              )}
            </Stack>
          </Box>
        )}
      </Box>
      {isEditing && (
        <Box
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100%",
            bgcolor: theme.custom.surface.main,
            boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
            paddingY: "15px",
            paddingX: "24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            variant="outlined"
            disableElevation={true}
            sx={{
              borderRadius: "40px",
              paddingY: "12px",
              paddingX: "42px",
              textTransform: "none",
              width: "131px",
              height: "47px",
            }}
            onClick={handleCancelClick}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            disableElevation={true}
            sx={{
              borderRadius: "40px",
              paddingY: "12px",
              paddingX: "42px",
              textTransform: "none",
              width: "131px",
              height: "47px",
            }}
            onClick={handleSaveClick}
          >
            Save
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default ProjectDetails;
