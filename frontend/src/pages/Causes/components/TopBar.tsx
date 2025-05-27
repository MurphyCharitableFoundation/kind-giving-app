import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Box, IconButton, Typography } from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import theme from "../../../theme/theme";

const iconButtonStyles = {
  bgcolor: "action.hover",
  borderRadius: "50%",
  backgroundColor: theme.custom.surface.main,
  color: theme.custom.surface.onColorVariant,
};

interface TopBarProps {
  children?: string;
  causeId?: string;
  isCreating: boolean;
  isEditing?: boolean;
}

const TopBar = ({ children, causeId, isCreating, isEditing }: TopBarProps) => {
  const navigate = useNavigate();

  const redirectToEditedCause = () => {
    navigate(`/causes/${causeId}/edit`);
  };

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
          to={isEditing ? `/causes/${causeId}` : "/causes"}
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

      {/* icons div when not creating a new cause*/}
      {!isCreating && (
        <Box>
          <IconButton aria-label="Attach file" sx={iconButtonStyles}>
            <AttachFileIcon />
          </IconButton>

          <IconButton
            aria-label="Edit"
            sx={iconButtonStyles}
            onClick={redirectToEditedCause}
          >
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
      )}
    </Box>
  );
};

export default TopBar;
