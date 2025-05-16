import { Typography } from "@mui/material";
import theme from "../../../../theme/theme";
import { ReactNode } from "react";

interface HeaderTitlesProps {
  children: ReactNode;
}

const HeaderTitles = ({ children }: HeaderTitlesProps) => {
  return (
    <Typography
      variant="titleXSmalltextMedium"
      component={"p"}
      sx={{
        color: theme.palette.primary.main,
      }}
    >
      {children}
    </Typography>
  );
};

export default HeaderTitles;
