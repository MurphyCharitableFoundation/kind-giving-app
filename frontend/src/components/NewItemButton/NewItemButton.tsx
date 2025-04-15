import { Box, Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

interface NewItemButtonProps {
  children?: string;
  onClick?: () => void;
}

const NewItemButton = ({ children, onClick }: NewItemButtonProps) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Button
        startIcon={<AddIcon sx={{ fontSize: "18px" }} />}
        variant="contained"
        disableElevation
        onClick={onClick}
        sx={{
          borderRadius: "40px",
          textTransform: "none",
          paddingY: "10px",
          paddingX: "24px",
          alignItems: "center",
        }}
      >
        <Typography>{children}</Typography>
      </Button>
    </Box>
  );
};

export default NewItemButton;
