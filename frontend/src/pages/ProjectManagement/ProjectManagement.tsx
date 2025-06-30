import { Box, Card, CardActionArea, CardContent, CardMedia, Container, Stack, Typography } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import CircleIcon from '@mui/icons-material/Circle';
import projectImage from '../../assets/images/project-image-sample.png';
import TargetProgressBar from '../../components/TargetProgressBar';
import theme from '../../theme/theme';
import { fetchAllProjects, Project } from '../../utils/projectsEndpoints';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import NewItemButton from '../../components/NewItemButton/NewItemButton';
import SearchBar from '../../components/SearchBar/SearchBar';
import { useSearchParams } from 'react-router-dom';
import PaginationContainer from '../../components/PaginationContainer';

const ProjectManagement: React.FC = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState<Project[]>([]);
    const [searchParams] = useSearchParams();
    const [totalCount, setTotalCount] = useState(0);
    const params = useMemo(() => ({
        limit: Number(searchParams.get('limit')) || 10,
        offset: Number(searchParams.get('offset')) || 0,
    }), [searchParams]);

    useEffect(() => {
        fetchAllProjects(params)
            .then((paginatedData) => {
                console.log("paginated data: ", paginatedData)
                setProjects(paginatedData.results)
                setTotalCount(paginatedData.count)
            })
            .catch((err) => console.error("Failed to fetch projects: ", err))
    }, [params])

    const handleProjectPress = (projectId: number) => {
        console.log(projectId)
        navigate(`/projects/${projectId}`)
    }

    return (
        <Container sx={{ padding: 0 }}>
            {/* Header */}
            <Navbar>Projects</Navbar>
            {/* Main container */}
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
                <SearchBar />
                {/* New project button */}
                <NewItemButton>New Project</NewItemButton>
                {/* List of projects */}
                {projects.length === 0 ? (
                    <>
                        <Typography color={theme.custom.surface.onColorVariant} variant='titleMediumtextMedium'>No project finded, time to create a new one!</Typography>
                    </>
                ) : (
                    <PaginationContainer count={totalCount} limit={params.limit} offset={params.offset}>
                        <Stack
                            direction='column'
                            spacing='10px'
                        >
                            {projects.map((project) => (
                                <CardActionArea
                                    key={project.id}
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
                                                    <Typography variant='titleLargetextSemiBold'>
                                                        {/* {project.title} */}
                                                        {project.name}
                                                    </Typography>
                                                    <CircleIcon
                                                        sx={{
                                                            fontSize: '24px',
                                                            color: project.status === 'active' ? theme.status.success.main : theme.status.warning.main
                                                        }}
                                                    />
                                                </Box>
                                                <Typography variant='bodySmall'>
                                                    {project.description}
                                                </Typography>
                                                <TargetProgressBar progress={project.donation_percentage} />
                                                <Typography>
                                                    <Typography component="span" sx={{ color: theme.palette.primary.main, fontWeight: 'bold', mr: 0.5 }}>
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
                    </PaginationContainer>
                )}
            </Box>
        </Container>
    )
}

export default ProjectManagement