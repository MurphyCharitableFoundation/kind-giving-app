import React from "react";
import { FormControl, OutlinedInput, InputLabel, Box } from "@mui/material";
import { styled, SxProps, Theme } from '@mui/material/styles';

const NotchedOutlinedInput = styled(OutlinedInput)`
  & .MuiOutlinedInput-notchedOutline legend{
    max-width:100%;
  }
`;
const InnerComponentBox = styled(Box)`
  width:100%;
  text-align:center;
  padding: 7px;
`;
const OutlinedFormControl = styled(FormControl)`
  width:100%;
  margin-top:8px;
`;

interface OutlinedFormContainerProps {
    label: string;
    children: React.ReactNode;
    sx?: SxProps<Theme>;
}

const OutlinedFormContainer: React.FC<OutlinedFormContainerProps> = ({ label, children }) => {
    const InnerComponent = () => (<InnerComponentBox>{children}</InnerComponentBox>);

    return (
        <OutlinedFormControl>
            <InputLabel shrink>{label}</InputLabel>
            <NotchedOutlinedInput
                label={label}
                inputComponent={InnerComponent}
            />
        </OutlinedFormControl>
    );
};

export default OutlinedFormContainer;