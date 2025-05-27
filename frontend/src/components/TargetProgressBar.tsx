import { Box, LinearProgress } from '@mui/material'
import React from 'react'
import theme from '../theme/theme';

interface TargetProgressBarProps {
    progress: number;
}

const TargetProgressBar: React.FC<TargetProgressBarProps> = ({progress}) => {

  return (
    <Box sx={{ width: "100%", position: "relative", height: 10 }}>
    {/* Foreground Progress Bar */}
    <Box sx={{ position: "absolute", left: 0, width: `calc(${progress}% - ${5}px)` }}>
        <LinearProgress
            variant="determinate"
            value={100}
            sx={{
                height: 8,
                borderRadius: 5,
                backgroundColor: "transparent",
                "& .MuiLinearProgress-bar": {
                    backgroundColor: theme.palette.primary.main,
                },
            }}
        />
    </Box>
    {/* Background Track (starts slightly after the progress bar ends) */}
    <Box sx={{ position: "absolute", left: `calc(${progress}%)`, width: `calc(100% - ${progress}%)` }}>
        <LinearProgress
            variant="determinate"
            value={100}
            sx={{
                height: 8,
                borderRadius: 5,
                backgroundColor: "transparent",
                "& .MuiLinearProgress-bar": {
                    backgroundColor: theme.palette.secondary.container,
                },
            }}
        />
    </Box>
</Box>
  )
}

export default TargetProgressBar