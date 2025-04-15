import { Box, Button, Card, CardActionArea, CardContent, CardMedia, Container, InputBase, Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import CircleIcon from '@mui/icons-material/Circle';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import projectImage from '../../../assets/images/project-image-sample.png';
import TargetProgressBar from '../../../components/TargetProgressBar';
import theme from '../../../theme/theme';
import { fetchAllProjects, Project } from '../../../utils/projectsEndpoints';
import { useNavigate } from 'react-router-dom';

const ProjectManagement: React.FC = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        fetchAllProjects()
            .then(setProjects)
            .catch((err) => console.error("Failed to fetch projects: ", err))
    }, [])

    const handleProjectPress = (projectId: number) => {
        console.log(projectId)
        navigate(`/admin/projects/${projectId}`)
    }

    return (
        <Container sx={{ padding: 0 }}>
            {/* Header */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingY: '18px',
                    paddingX: '16px',
                    bgcolor: theme.custom.misc.background,
                }}
            >
                <Box
                    sx={{ display: 'flex', flexDirection: 'row', gap: '18px' }}
                >
                    <MenuIcon sx={{ fontSize: '24px' }} />
                    <Typography>Projects</Typography>
                </Box>
                <AccountCircleIcon sx={{ fontSize: '24px' }} />
            </Box>
            <Box
                sx={{
                    padding: '15px',
                    bgcolor: theme.custom.misc.background,
                    marginTop: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    minHeight: '100vh'
                }}
            >
                {/* Search Projects Input */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        borderRadius: '40px',
                        padding: '16px',
                        alignItems: 'center',
                        gap: '4px',
                        bgcolor: theme.custom.surfaceContainer.high,
                    }}
                >
                    <FilterListIcon sx={{ fontSize: '24px', color: theme.custom.surface.onColor }} />
                    <InputBase placeholder='Search projects' sx={{ flex: 1 }} />
                    <SearchIcon sx={{ fontSize: '24px', marginRight: '40px', color: theme.custom.surface.onColorVariant }} />
                </Box>
                {/* New project button */}
                <Box sx={{ display: 'flex', justifyContent: 'center', }}>
                    <Button
                        startIcon={<AddIcon sx={{ fontSize: '18px' }} />}
                        variant='contained'
                        disableElevation
                        sx={{
                            borderRadius: '40px',
                            textTransform: 'none',
                            paddingY: '10px',
                            paddingX: '24px',
                            alignItems: 'center'
                        }}>
                        <Typography>New Project</Typography>
                    </Button>
                </Box>
                {/* List of projects */}
                <Stack
                    direction='column'
                    spacing='10px'
                >
                    {projects.map((project) => (
                        <CardActionArea
                            onClick={() => handleProjectPress(project.id)}
                        >
                            <Card
                                sx={{
                                    borderRadius: '12px',
                                    transition: 'box-shadow 0.3s ease-in-out',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        boxShadow: 8,
                                    }
                                }}
                                elevation={4}
                            >
                                <CardMedia
                                    sx={{ height: 188 }}
                                    image={projectImage}
                                />
                                <CardContent
                                    sx={{ paddingY: '20px' }}
                                >
                                    <Box
                                        sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
                                    >
                                        <Box
                                            sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
                                        >
                                            <Typography>
                                                {/* {project.title} */}
                                                {project.name}
                                            </Typography>
                                            <CircleIcon sx={{ fontSize: '24px', color: theme.status.success.main }} />
                                        </Box>
                                        <Typography>
                                            {/* {project.description} */}
                                            No description
                                        </Typography>
                                        <TargetProgressBar progress={80} />
                                        <Typography>
                                            <Typography component="span" sx={{ color: theme.palette.primary.main, fontWeight: "bold", mr: 0.5 }}>
                                                {/* ${project.raised} */}
                                                $800
                                            </Typography>
                                            <Typography component="span" sx={{ fontWeight: "bold" }}>
                                                {/* of ${project.goal} */}
                                                of $1000
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
    )
}

export default ProjectManagement