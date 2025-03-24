import { Avatar, Box, Button, Card, CardContent, CardMedia, Container, Divider, FormControlLabel, Radio, RadioGroup, Stack, TextField, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import React, { useState } from 'react'
import theme from '../../../theme/theme';
import projectImage from '../../../assets/images/project-image-sample.png';
import SaveIcon from '@mui/icons-material/Save';
import OutlinedFormContainer from '../../../components/OutlinedFormContainer';

const ProjectDetails: React.FC = () => {
    const [isEditing, setIsEditing] = useState(false);
    const handleEditClick = () => setIsEditing(true);
    const handleCancelClick = () => setIsEditing(false);

    const [editableData, setEditableData] = useState({
        causes: ['Women', 'Children'],
        title: 'Lorem ipsum dolor sit amet, consectetur adipiscing',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        status: 'Running',
    });

    const handleChange = (field: keyof typeof editableData, value: string) => {
        setEditableData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <Container sx={{ padding: 0 }}>
            {/* Header */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingY: '18px',
                    paddingLeft: '16px',
                    paddingRight: '8px',
                    alignItems: 'center',
                    bgcolor: theme.custom.misc.background,
                }}
            >
                <Box
                    sx={{ display: 'flex', flexDirection: 'row', gap: '8px' }}
                >
                    <Box>
                        <ArrowBackIcon />
                    </Box>
                    <Typography>Project details</Typography>
                </Box>
                {!isEditing && (
                    <Box
                        sx={{ display: 'flex', flexDirection: 'row', gap: '4px' }}
                    >
                        <Avatar sx={{ bgcolor: theme.palette.secondary.container, cursor: 'pointer' }} onClick={handleEditClick}>
                            {isEditing ? <SaveIcon sx={{ color: theme.custom.surface.onColorVariant }} /> : <EditIcon sx={{ color: theme.custom.surface.onColorVariant }} />}
                        </Avatar>
                        <Avatar sx={{ bgcolor: theme.palette.secondary.container }}>
                            <DeleteIcon sx={{ color: theme.custom.surface.onColorVariant }} />
                        </Avatar>
                    </Box>
                )}
            </Box>
            {/* Project details container */}
            <Box
                sx={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '10px', padding: '15px', bgcolor: isEditing ? 'white' : theme.custom.misc.background }}
            >
                {/* Causes */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {!isEditing && (
                        <Typography color={theme.palette.primary.main}>Causes</Typography>
                    )}
                    {isEditing ? (
                        <TextField
                            fullWidth
                            label='Causes'
                            variant="outlined"
                            value={editableData.causes.join(', ')}
                            onChange={(e) => handleChange('causes', e.target.value)}
                        />
                    ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'row', gap: '13px' }}>
                            {editableData.causes.map((cause, index) => (
                                <Button key={index} variant="contained" disableElevation sx={{ borderRadius: '40px', bgcolor: theme.palette.secondary.container, textTransform: 'none' }}>
                                    <Typography color={theme.palette.primary.main}>{cause}</Typography>
                                </Button>
                            ))}
                        </Box>
                    )}
                </Box>
                {/* Title */}
                <Box
                    sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {!isEditing && (
                        <Typography color={theme.palette.primary.main}>Title</Typography>
                    )}
                    {isEditing ? (
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Title"
                            value={editableData.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                        />
                    ) : (
                        <Typography color={theme.custom.surface.onColor}>{editableData.title}</Typography>
                    )}
                </Box>
                {/* Description */}
                <Box
                    sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {!isEditing && (
                        <Typography color={theme.palette.primary.main}>Description</Typography>
                    )}
                    {isEditing ? (
                        <TextField
                            fullWidth
                            multiline
                            label="Description"
                            variant="outlined"
                            value={editableData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                        />
                    ) : (
                        <Typography color={theme.custom.surface.onColor}>{editableData.description}</Typography>
                    )}
                </Box>
                {/* Images Carousel */}
                {!isEditing && (
                    <>
                        <Typography color={theme.palette.primary.main}>Images</Typography>
                        <Card>
                            <CardMedia
                                sx={{ height: 188 }}
                                image={projectImage}
                            />
                        </Card>
                    </>
                )}
                {/* Project details */}
                {/* Status */}
                <Box
                    sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
                >
                    {isEditing ? (
                        <OutlinedFormContainer label="Status">
                            <RadioGroup
                                row={true}
                                sx={{ paddingLeft: '28px', gap: '20px' }}
                            >
                                <FormControlLabel value="active" control={<Radio />} label="Active" />
                                <FormControlLabel value="inactive" control={<Radio />} label="Inactive" />
                            </RadioGroup>
                        </OutlinedFormContainer>
                    ) : (
                        <>
                            <Typography color={theme.palette.primary.main}>Status</Typography>
                            <Typography color={theme.custom.surface.onColor}>{editableData.status}</Typography>
                        </>
                    )}
                </Box>
                {/* Start and end date */}
                <Box
                    sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
                >
                    <Box
                        sx={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'start' }}
                    >
                        <Typography color={theme.palette.primary.main}>Start</Typography>
                        <Typography color={theme.custom.surface.onColor}>19/19/2022</Typography>
                    </Box>
                    <Box
                        sx={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'start' }}
                    >
                        <Typography color={theme.palette.primary.main}>End</Typography>
                        <Typography color={theme.custom.surface.onColor}>19/19/2292</Typography>
                    </Box>
                </Box>
                <Box
                    sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', }}
                >
                    <Box
                        sx={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'start' }}
                    >
                        <Typography color={theme.palette.primary.main}>Target</Typography>
                        <Typography color={theme.custom.surface.onColor}>$500</Typography>
                    </Box>
                    <Box
                        sx={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'start' }}
                    >
                        <Typography color={theme.palette.primary.main}>Achieved</Typography>
                        <Typography color={theme.custom.surface.onColor}>$444</Typography>
                    </Box>
                </Box>
                {/* Beneficaries list */}
                {!isEditing && (
                    <>
                        <Divider />
                        <Box
                            sx={{ display: 'flex', flexDirection: 'column' }}
                        >
                            <Typography color={theme.custom.surface.onColor}>Beneficaries</Typography>
                            <Stack
                                direction='column'
                                spacing='7px'
                                sx={{ marginTop: '17px' }}
                            >
                                <Card
                                    elevation={0}
                                    sx={{ display: 'flex', padding: '8px', border: 1, borderColor: theme.custom.misc.outlineVariant, borderRadius: '16px' }}
                                >
                                    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                                        <CardMedia
                                            sx={{ width: '94px', height: '100px', borderRadius: '16px' }}
                                            image={projectImage}
                                        />
                                        <CardContent sx={{ p: 0, '&:last-child': { pb: 0 }, paddingLeft: '10px' }}>
                                            <Box
                                                sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
                                            >
                                                <Typography color={theme.custom.misc.shadow}>Group name</Typography>
                                                {/* Beneficiaries interests */}
                                                <Typography color={theme.custom.surface.onColorVariant}>
                                                    Interests: {" "}
                                                    <Typography component="span" color={theme.custom.surface.onColorVariant}>
                                                        Women loan supports, babysit,
                                                    </Typography>
                                                </Typography>
                                                {/* Amount disbursed to beneficiary */}
                                                <Typography color={theme.custom.surface.onColorVariant}>
                                                    Disbursed: {" "}
                                                    <Typography component="span" color={theme.status.success.main} fontWeight="bold">
                                                        $75.00
                                                    </Typography>
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </Box>
                                </Card>
                                <Button
                                    variant='contained'
                                    disableElevation
                                    sx={{ bgcolor: theme.custom.surfaceContainer.lowest, border: 1, borderColor: theme.custom.misc.outline, borderRadius: '20px' }}
                                >
                                    <Typography color={theme.palette.primary.main}>View all</Typography>
                                </Button>
                            </Stack>
                        </Box>
                        <Divider />
                    </>
                )}
                {/* Campaigns list */}
                {!isEditing && (
                    <Box
                        sx={{ display: 'flex', flexDirection: 'column' }}
                    >
                        <Typography color={theme.custom.surface.onColor}>Campaigns</Typography>
                        <Stack
                            direction='column'
                            spacing='7px'
                            sx={{ marginTop: '17px' }}
                        >
                            <Card
                                elevation={0}
                                sx={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '8px', border: 1, borderColor: theme.custom.misc.outlineVariant, borderRadius: '16px' }}
                            >
                                <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                                    <CardMedia
                                        sx={{ width: '94px', height: '100px', borderRadius: '16px', flexShrink: 0 }}
                                        image={projectImage}
                                    />
                                    <CardContent sx={{ p: 0, '&:last-child': { pb: 0 }, paddingLeft: '10px' }}>
                                        <Box
                                            sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
                                        >
                                            <Typography color={theme.custom.misc.shadow}>Group name</Typography>
                                            <Typography color={theme.custom.surface.onColorVariant}>Description duis aute irure dolor in voluptate velit.</Typography>
                                        </Box>
                                    </CardContent>
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    {/* Campaign collected amount */}
                                    <Typography color={theme.custom.surface.onColorVariant}>
                                        Collected:{" "}
                                        <Typography component="span" color={theme.status.success.main} fontWeight="bold">
                                            $75.00
                                        </Typography>
                                    </Typography>
                                    {/* Campaign donations count */}
                                    <Typography color={theme.custom.surface.onColorVariant}>
                                        <Typography component="span" color={theme.status.success.main} fontWeight="bold">
                                            9
                                        </Typography>{" "}
                                        Donations
                                    </Typography>
                                </Box>
                            </Card>
                            <Button
                                variant='contained'
                                disableElevation
                                sx={{ bgcolor: theme.custom.surfaceContainer.lowest, border: 1, borderColor: theme.custom.misc.outline, borderRadius: '20px' }}
                            >
                                <Typography color={theme.palette.primary.main}>View all</Typography>
                            </Button>
                        </Stack>
                    </Box>
                )}
            </Box>
            {isEditing && (
                <Box
                    sx={{
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        bgcolor: theme.custom.surface.main,
                        boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
                        paddingY: '15px',
                        paddingX: '24px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <Button
                        variant="outlined"
                        disableElevation={true}
                        sx={{ borderRadius: '40px', paddingY: '12px', paddingX: '42px', textTransform: 'none', width: '131px', height: '47px' }}
                        onClick={handleCancelClick}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        disableElevation={true}
                        sx={{ borderRadius: '40px', paddingY: '12px', paddingX: '42px', textTransform: 'none', width: '131px', height: '47px' }}
                    >
                        Save
                    </Button>
                </Box>
            )}
        </Container>
    )
}

export default ProjectDetails