import { Typography } from "@mui/material";
import theme from "../../../theme/theme";

interface TextContentProps {
  text: string | undefined;
}

const TextContent = ({ text }: TextContentProps) => {
  return (
    <Typography
      variant="bodySmall"
      component={"p"}
      sx={{
        color: theme.custom.surface.onColor,
      }}
    >
      {text}
    </Typography>
  );
};

export default TextContent;
