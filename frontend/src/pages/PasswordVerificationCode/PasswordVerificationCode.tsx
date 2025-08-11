import { Box, Button, Container, Icon, Modal, TextField, Typography } from '@mui/material'
import React, { useRef, useState } from 'react'
import theme from '../../theme/theme'
import { Height } from '@mui/icons-material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';

const PasswordVerificationCode = () => {
    const navigate = useNavigate();
    const [codes, setCodes] = useState(['', '', '', '', '']);
    const inputRefs = useRef<HTMLInputElement[]>([]);
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (value: string, index: number) => {
        if (!/^\d*$/.test(value)) return; // Only allow digits

        const newCodes = [...codes];
        newCodes[index] = value.slice(-1); // Ensure 1 digit max
        setCodes(newCodes);

        // Move focus to next input
        if (value && index < codes.length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (
        e: React.KeyboardEvent,
        index: number
    ) => {
        const target = e.target as HTMLInputElement;

        if (e.key === 'Backspace' && !target.value && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const verify = () => {
        //if verification result its sucess:
        //open modal
    }

    return (
        <Container
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '40px',
                px: '24px',
                py: '8px',
                bgcolor: theme.custom.surface.main,
                minHeight: '100vh'
            }}
        >
            <Typography color={theme.palette.primary.main} variant="headlineXsmallTextMedium">Kind Giving</Typography>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
            }}>
                <Typography variant="titleXLargetextMedium" color={theme.custom.surface.onColor}>Verification code</Typography>

                <Typography variant="bodyMedium" color={theme.custom.surface.onColorVariant}>We’ve sent a 6-digit verification code to your email address. Please enter it below to reset your password.</Typography>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px'
                }}>
                <Box display="flex" gap={2} justifyContent="center">
                    {codes.map((digit, i) => (
                        <TextField
                            key={i}
                            inputRef={(el) => {
                                if (el) inputRefs.current[i] = el;
                            }}
                            value={digit}
                            onChange={(e) => handleChange(e.target.value, i)}
                            onKeyDown={(e) => handleKeyDown(e, i)}
                            sx={{
                                width: '52px',
                                height: '56px'
                            }}
                            slotProps={{
                                htmlInput: {
                                    style: {
                                        textAlign: 'center',
                                        fontSize: '16px',
                                        color: theme.custom.surface.onColor,
                                    },
                                }
                            }}
                            variant="outlined"
                        />
                    ))}
                </Box>
                <Button
                    variant="contained"
                    disableElevation
                    type="submit"
                    onClick={handleOpen}
                    disabled={codes.some(code => code === '')}
                    sx={{
                        paddingY: '10px',
                        height: '40px',
                        borderRadius: '40px',
                        textTransform: 'none',
                        width: '17rem',
                        alignSelf: 'center'
                    }}
                >
                    Verify
                </Button>
            </Box>
            <Modal
                open={open}
                onClose={handleClose}
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                }}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px',
                            alignItems: 'center',
                            bgcolor: theme.custom.surface.main,
                            p: '24px',
                            borderRadius: '28px',
                            boxShadow: theme.shadows[10],
                        }}
                    >
                        <CheckCircleIcon sx={{ color: theme.status.success.main, width: '40px', height: '40px' }} />
                        <Typography align="center">
                            Your code was successfully<br />verified!
                        </Typography>
                        <Button
                            variant="contained"
                            disableElevation
                            onClick={() => navigate('/password-reset/confirm/testing/testing')}
                            sx={{
                                paddingY: '10px',
                                height: '40px',
                                borderRadius: '40px',
                                textTransform: 'none',
                                alignSelf: 'center',
                                width: '100%'
                            }}
                        >
                            <Typography color={theme.palette.primary.onColor} variant='labelLarge'>Reset password</Typography>
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Container>
    )
}

export default PasswordVerificationCode