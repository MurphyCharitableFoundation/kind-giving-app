import React, { useState } from "react";
import { Box, Button, Stepper, Step, StepLabel, Typography } from "@mui/material";
import theme from "../theme/theme";

export interface StepProps<T> {
    data: T;
    onChange: (field: keyof T, value: any) => void;
}

export interface StepConfig<T> {
    label: string;
    component: React.ComponentType<StepProps<T>>;
}

interface MultiStepFormProps<T> {
    steps: StepConfig<T>[];
    initialData: T;
    onSubmit?: (data: T) => void;
}
export function MultiStepForm<T>({ steps, initialData, onSubmit }: MultiStepFormProps<T>) {
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState<T>(initialData);

    const CurrentStep = steps[activeStep].component;

    const handleNext = () => {
        if (activeStep === steps.length - 1) {
            onSubmit?.(formData); // trigger callback
            return;
        }
        setActiveStep((prev) => prev + 1);
    };

    const handleBack = () => setActiveStep((prev) => prev - 1);

    const handleChange = (field: keyof T, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <Box sx={{
            width: "100%",
            p: 3,
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
            mt: '40px',
            gap: '40px'
        }}>
            {/* Stepper Titles */}
            <Stepper activeStep={activeStep}
                sx={{
                    "& .MuiStepIcon-root": {
                        color: theme.palette.primary.onColor,
                        borderRadius: '50%'
                    },
                    "& .MuiStepIcon-root circle": {
                        stroke: theme.custom.misc.outline,  // inactive border color
                    },
                    "& .MuiStepIcon-root.Mui-active": {
                        color: theme.palette.primary.container, // active color
                    },
                    "& .MuiStepIcon-root.Mui-active circle": {
                        stroke: theme.palette.primary.main,  // active border color
                    },
                    "& .MuiStepIcon-root.Mui-completed": {
                        color: theme.palette.primary.main, // completed color
                    },
                    "& .MuiStepIcon-text": {
                        fill: theme.custom.misc.outline, // inactive number
                    },
                    "& .MuiStepIcon-root.Mui-active .MuiStepIcon-text": {
                        fill: theme.palette.primary.main, // active number
                    },
                }}
            >
                {steps.map((step) => (
                    <Step key={step.label}>
                        <StepLabel></StepLabel>
                    </Step>
                ))}
            </Stepper>

            {/* Step Component */}
            <Box sx={{ mt: 3 }}>
                <CurrentStep data={formData} onChange={handleChange} />
            </Box>

            {/* Navigation Buttons */}
            <Box sx={{
                display: "flex",
                justifyContent: 'space-between',
                pt: 2,
            }}>
                <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    variant="outlined"
                    disableElevation
                    sx={{
                        textTransform: 'none'
                    }}
                >
                    <Typography variant="labelLarge">Back</Typography>
                </Button>

                <Button variant="contained" onClick={handleNext} disableElevation
                    sx={{
                        textTransform: 'none'
                    }}
                    >
                    {activeStep === steps.length - 1 ?
                        <Typography variant="labelLarge">Submit</Typography> :
                        <Typography variant="labelLarge">Next</Typography>}
                </Button>
            </Box>
        </Box>
    );
}