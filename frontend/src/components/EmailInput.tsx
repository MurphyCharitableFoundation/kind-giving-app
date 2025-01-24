import { TextField } from "@mui/material";
import { ChangeEvent } from "react";

interface EmailInputProps {
  name: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  error: boolean;
  helperText: string;
}

const EmailInput = ({
  name,
  value,
  onChange,
  error,
  helperText,
}: EmailInputProps) => {
  return (
    <TextField
      name={name}
      id="email"
      label="E-mail"
      value={value}
      onChange={onChange}
      error={error}
      helperText={helperText}
    />
  );
};

export default EmailInput;
