import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { ChangeEvent, useState } from "react";

interface PasswordInputProps {
  name: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  error: boolean;
  helperText: string;
}

const PasswordInput = ({
  name,
  value,
  onChange,
  error,
  helperText,
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  return (
    <TextField
      id="password"
      name={name}
      label="Password"
      type={showPassword ? "text" : "password"}
      value={value}
      onChange={onChange}
      error={error}
      helperText={helperText}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={handleClickShowPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
};

export default PasswordInput;
