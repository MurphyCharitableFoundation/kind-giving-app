import { Button, Typography } from "@mui/material";
import theme from "../../../theme/theme";

interface EditButtonProps {
  children?: string;
  onClick?: () => void;
}

const EditButton = ({ children, onClick }: EditButtonProps) => {
  return (
    <Button
      variant="contained"
      disableElevation
      sx={{
        borderRadius: "40px",
        textTransform: "none",
        paddingY: "10px",
        paddingX: "24px",
        alignItems: "center",
        backgroundColor: theme.palette.secondary.container,
        width: "122px",
        height: "42px",
      }}
      onClick={onClick}
    >
      <Typography
        sx={{
          color: theme.palette.secondary.onContainer,
        }}
      >
        {children}
      </Typography>
    </Button>
  );
};

export default EditButton;
