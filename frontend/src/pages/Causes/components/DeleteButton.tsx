import { Button, Typography } from "@mui/material";
import theme from "../../../theme/theme";

interface DeleteButtonProps {
  children?: string;
  onClick?: () => void;
}

const DeleteButton = ({ children, onClick }: DeleteButtonProps) => {
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
        backgroundColor: theme.custom.surfaceContainer.low,
        width: "122px",
        height: "42px",
        boxShadow: "3",
      }}
      onClick={onClick}
    >
      <Typography
        sx={{
          color: theme.palette.primary.main,
        }}
      >
        {children}
      </Typography>
    </Button>
  );
};

export default DeleteButton;
