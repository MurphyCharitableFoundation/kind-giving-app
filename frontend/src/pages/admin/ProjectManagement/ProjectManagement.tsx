import { Box, Button, Card, CardContent, CardMedia, Container, InputBase, Stack, Typography } from '@mui/material'
import React from 'react'
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import CircleIcon from '@mui/icons-material/Circle';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import projectImage from '../../../assets/images/project-image-sample.png';
import TargetProgressBar from '../../../components/TargetProgressBar';
import theme from '../../../theme/theme';

const ProjectManagement: React.FC = () => {

    const projects = [
        { title: "Project Title", description: "Lupita needs a medical fee for her son’s surgery", progress: 40, goal: 1000, raised: 400 },
        { title: "Another Project", description: "Helping kids get school supplies", progress: 60, goal: 500, raised: 300 },
        { title: "Project Title", description: "Lupita needs a medical fee for her son’s surgery", progress: 40, goal: 1000, raised: 400 },
        { title: "Another Project", description: "Helping kids get school supplies", progress: 60, goal: 500, raised: 300 },
    ];

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
                    gap: '16px'
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
                        <Card
                            sx={{ borderRadius: '12px' }}
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
                                            {project.title}
                                        </Typography>
                                        <CircleIcon sx={{ fontSize: '24px', color: theme.status.success.main }} />
                                    </Box>
                                    <Typography>
                                        {project.description}
                                    </Typography>
                                        <TargetProgressBar progress={project.progress} />
                                    <Typography>
                                        <Typography component="span" sx={{ color: theme.palette.primary.main, fontWeight: "bold", mr: 0.5 }}>
                                            ${project.raised}
                                        </Typography>
                                        <Typography component="span" sx={{ fontWeight: "bold" }}>
                                            of ${project.goal}
                                        </Typography>
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Stack>
            </Box>
        </Container>
    )
}

export default ProjectManagement