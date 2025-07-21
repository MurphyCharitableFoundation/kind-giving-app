import React from "react";
import { FormControl, OutlinedInput, InputLabel, Box } from "@mui/material";
import { styled, SxProps, Theme } from "@mui/material/styles";

// const NotchedOutlinedInput = styled(OutlinedInput)`
//   & .MuiOutlinedInput-notchedOutline legend {
//     max-width: 100%;
//   }
// `;
// const InnerComponentBox = styled(Box)`
//   width: 100%;
//   text-align: center;
//   padding: 7px;
// `;
// const OutlinedFormControl = styled(FormControl)`
//   width: 100%;
//   margin-top: 8px;
// `;

interface OutlinedFormContainerProps {
  label: string;
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}

const OutlinedFormContainer: React.FC<OutlinedFormContainerProps> = ({
  label,
  children,
  sx,
}) => {
  return (
    <Box
      sx={{
        position: "relative",
        border: "1px solid rgba(0, 0, 0, 0.23)",
        borderRadius: "4px",
        ...sx,
      }}
    >
      <InputLabel
        sx={{
          position: "absolute",
          top: "-8px",
          left: "8px",
          backgroundColor: "#fff",
          paddingX: "4px",
          fontSize: "12px",
        }}
      >
        {label}
      </InputLabel>
      {children}
    </Box>
  );
};

export default OutlinedFormContainer;
