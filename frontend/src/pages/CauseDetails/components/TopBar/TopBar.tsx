import { Link as RouterLink } from "react-router-dom";
import { Box, IconButton, Typography } from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import theme from "../../../../theme/theme";

const iconButtonStyles = {
  bgcolor: "action.hover",
  borderRadius: "50%",
  backgroundColor: theme.custom.surface.main,
  color: theme.custom.surface.onColorVariant,
};

interface TopBarProps {
  children?: string;
}

const TopBar = ({ children }: TopBarProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "5px",
        backgroundColor: theme.custom.surface.main,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <IconButton
          component={RouterLink}
          to="/causes"
          aria-label="Go back"
          sx={{
            bgcolor: "action.hover",
            borderRadius: "50%",
            backgroundColor: theme.custom.surface.main,
            color: theme.custom.surface.onColor,
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        <Typography variant="titleXLargetextMedium">{children}</Typography>
      </Box>

      {/* icons div */}
      <Box>
        <IconButton aria-label="Attach file" sx={iconButtonStyles}>
          <AttachFileIcon />
        </IconButton>

        <IconButton aria-label="Edit" sx={iconButtonStyles}>
          <EditOutlinedIcon />
        </IconButton>

        <IconButton
          aria-label="More options"
          aria-haspopup="menu"
          sx={iconButtonStyles}
        >
          <MoreVertIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default TopBar;
