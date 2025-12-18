import { Box, Button, Card, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import { ChangeEvent, FormEvent, useState } from "react";
import PasswordInput from "../../../components/PasswordInput";
import theme from "../../../theme/theme";

interface PasswordResetForm {
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
}

interface PasswordResetFormErrors {
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
}
const PasswordResetForm: React.FC = () => {

    const [passwordData, setPasswordData] = useState<PasswordResetForm>({
        currentPassword: "", newPassword: "", confirmPassword: ""
    });
    const [errors, setPasswordErrors] = useState<PasswordResetFormErrors>({
        currentPassword: "", newPassword: "", confirmPassword: ""
    })

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setPasswordData({
            ...passwordData,
            [name]: value
        });

        setPasswordErrors({
            ...errors,
            [name]: ""
        })
    };

    // Validate password for the password reset
    const PASSWORD_RULES = {
        minLength: 8,
        uppercase: /[A-Z]/,
        lowercase: /[a-z]/,
        number: /\d/,
        special: /[!@#$%^&*]/,
    };


    const validatePasswordReset = () => {
        const newErrors: PasswordResetFormErrors = {
            currentPassword: "", newPassword: "", confirmPassword: ""
        }
        let isValid = true;
        const pwd = passwordData.newPassword
        if (!passwordData.currentPassword) {
            newErrors.currentPassword = "Current password is required!";
            isValid = false;
        };

        if (!pwd) {
            newErrors.newPassword = "New password is required!",
                isValid = false;

        } else if (pwd.length < 8) {
            newErrors.newPassword = "Password must be at least 8 characters.";
            isValid = false;
        } else if (!/[A-Z]/.test(pwd)) {
            newErrors.newPassword = "Password must contains at least 1 uppercase letter (A-Z)."
            isValid = false
        } else if (!/[a-z]/.test(pwd)) {
            newErrors.newPassword = "Password must contains at least 1 lowercase letter (a-z)."
            isValid = false
        } else if (!/\d/.test(pwd)) {
            newErrors.newPassword = "Password must contains at least 1 number (0-9) ."
            isValid = false
        } else if (!/[!@#$%^&*]/.test(pwd)) {
            newErrors.newPassword = "Password must contains at least 1 special character (e.g., !@#$%^&*) ."
            isValid = false
        }
        if (!passwordData.confirmPassword) {
            newErrors.confirmPassword = "Confirm Password is required!",
                isValid = false;
        }
        else if (passwordData.newPassword !== passwordData.confirmPassword) {
            newErrors.confirmPassword = "Password must match!",
                isValid = false
        }
        setPasswordErrors(newErrors);
        return isValid;
    };

    const submitPasswordReset = async (e: FormEvent) => {
        e.preventDefault();
        if (!validatePasswordReset()) {
            console.log("Got error!");
            return;
        }

        try {
            console.log("Got it!");
        } catch (error: any) {
            console.log("Submission error: ", error)
        }
    }
    return (
        <Card
            component={"form"}
            onSubmit={submitPasswordReset}
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                width: "100%",
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
                borderBottomLeftRadius: "12px",
                borderBottomRightRadius: "12px",
                paddingTop: "16px",
                paddingX: "24px",


            }}
        >


            <PasswordInput
                name="currentPassword" label="Current Password" value={passwordData.currentPassword}
                onChange={handleInputChange}
                error={errors.currentPassword ? true : false}
                helperText={errors.currentPassword}

            ></PasswordInput>
            <PasswordInput
                name="newPassword" label="New Password" value={passwordData.newPassword}
                onChange={handleInputChange}
                error={errors.newPassword ? true : false}
                helperText={errors.newPassword}
            >

            </PasswordInput>

            <PasswordInput
                name="confirmPassword" label="Confirm Password" value={passwordData.confirmPassword}
                onChange={handleInputChange} error={errors.confirmPassword ? true : false}
                helperText={errors.confirmPassword}
            ></PasswordInput>

            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
            }}>

                <Typography variant="bodyMedium" color={theme.custom.surface.onColorVariant}>
                    Make sure your new password includes: <br />
                    At least 8 characters <br />
                    At least 1 uppercase letter (A-Z) <br />
                    At least 1 lowercase letter (a-z) <br />
                    At least 1 number (0-9) <br />
                    At least 1 special character (e.g., !@#$%^&*)
                </Typography>
            </Box>

            <Typography>
                Forgot your password?
                <Typography sx={{ color: theme.palette.primary.main }}>
                    <RouterLink to="/forgot-password" >Reset it</RouterLink></Typography>

            </Typography>
            <Box sx={{
                display: "flex",
                flexDirection: "row",
                gap: "11px",
                justifyContent: "center",
                marginBottom: "24px"
            }}>
                <Button sx={{
                    bgcolor: theme.palette.primary.container, textTransform: 'none',
                    paddingY: '10px', paddingX: "24px", borderRadius: "24px", width: "100%", height: "32px"

                }}>  <Typography sx={{ color: theme.palette.primary.main }}>
                        Cancel
                    </Typography></Button>
                <Button sx={{
                    bgcolor: theme.palette.primary.main, textTransform: 'none'
                    , paddingY: '10px', paddingX: "24px", borderRadius: "24px", width: "100%", height: "32px"

                }} type="submit">

                    <Typography sx={{ color: theme.palette.primary.onColor }}>
                        Save
                    </Typography></Button>
            </Box>
        </Card>

    )
}

export default PasswordResetForm;