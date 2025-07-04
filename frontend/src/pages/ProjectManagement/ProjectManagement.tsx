import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CircleIcon from "@mui/icons-material/Circle";
import projectImage from "../../assets/images/project-image-sample.png";
import TargetProgressBar from "../../components/TargetProgressBar";
import theme from "../../theme/theme";
import { fetchAllProjects, Project } from "../../utils/projectsEndpoints";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import NewItemButton from "../../components/NewItemButton/NewItemButton";
import SearchBar from "../../components/SearchBar/SearchBar";

const ProjectManagement: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetchAllProjects()
      .then(setProjects)
      .catch((err) => console.error("Failed to fetch projects: ", err));
  }, []);

  const handleProjectPress = (projectId: number) => {
    console.log(projectId);
    navigate(`/projects/${projectId}`);
  };

  return (
    <Container sx={{ padding: 0 }}>
      {/* Header */}
      <Navbar>Projects</Navbar>
      {/* Main container */}
      <Box
        sx={{
          padding: "15px",
          bgcolor: theme.custom.misc.background,
          marginTop: "10px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          minHeight: "100vh",
        }}
      >
        {/* Search Projects Input */}
        <SearchBar />
        {/* New project button */}
        <NewItemButton>New Project</NewItemButton>
        {/* List of projects */}
        <Stack direction="column" spacing="10px">
          {projects.map((project) => (
            <CardActionArea
              key={project.id}
              onClick={() => handleProjectPress(project.id)}
            >
              <Card
                sx={{
                  borderRadius: "12px",
                  transition: "box-shadow 0.3s ease-in-out",
                  cursor: "pointer",
                  "&:hover": {
                    boxShadow: 8,
                  },
                }}
                elevation={4}
              >
                <CardMedia sx={{ height: 188 }} image={projectImage} />
                <CardContent sx={{ paddingY: "20px" }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="titleLargetextSemiBold">
                        {/* {project.title} */}
                        {project.name}
                      </Typography>
                      <CircleIcon
                        sx={{
                          fontSize: "24px",
                          color:
                            project.status === "active"
                              ? theme.status.success.main
                              : theme.status.warning.main,
                        }}
                      />
                    </Box>
                    <Typography variant="bodySmall">
                      {project.description}
                    </Typography>
                    <TargetProgressBar progress={project.donation_percentage} />
                    <Typography>
                      <Typography
                        component="span"
                        sx={{
                          color: theme.palette.primary.main,
                          fontWeight: "bold",
                          mr: 0.5,
                        }}
                      >
                        {/* ${project.raised} */}
                        $800
                      </Typography>
                      <Typography component="span" sx={{ fontWeight: "bold" }}>
                        {/* of ${project.goal} */}
                        of ${project.target}
                      </Typography>
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </CardActionArea>
          ))}
        </Stack>
      </Box>
    </Container>
  );
};

export default ProjectManagement;
