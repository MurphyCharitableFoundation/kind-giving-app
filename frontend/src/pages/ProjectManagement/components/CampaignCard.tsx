import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";
import theme from "../../../theme/theme";
import projectImage from "../../../assets/images/project-image-sample.png";
import React from "react";
import { ProjectCampaign } from "../../../utils/projectsEndpoints";

interface CampaignCardProps {
  campaign: ProjectCampaign;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign }) => {
  return (
    <Card
      elevation={0}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        padding: "8px",
        border: 1,
        borderColor: theme.custom.misc.outlineVariant,
        borderRadius: "16px",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <CardMedia
          sx={{
            width: "94px",
            height: "100px",
            borderRadius: "16px",
            flexShrink: 0,
          }}
          image={projectImage}
        />
        <CardContent
          sx={{ p: 0, "&:last-child": { pb: 0 }, paddingLeft: "10px" }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <Typography
              color={theme.custom.misc.shadow}
              variant="titleSmalltextMedium"
            >
              {campaign.title}
            </Typography>
            <Typography
              color={theme.custom.surface.onColorVariant}
              variant="bodySmall"
            >
              {campaign.description}
            </Typography>
          </Box>
        </CardContent>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Campaign collected amount */}
        <Typography
          color={theme.custom.surface.onColorVariant}
          variant="bodySmall"
        >
          Collected:{" "}
          <Typography
            component="span"
            color={theme.status.success.main}
            fontWeight="bold"
            variant="bodyLarge"
          >
            $75.00
          </Typography>
        </Typography>
        {/* Campaign donations count */}
        <Typography
          color={theme.custom.surface.onColorVariant}
          variant="bodySmall"
        >
          <Typography
            component="span"
            color={theme.status.success.main}
            fontWeight="bold"
            variant="bodyLarge"
          >
            9
          </Typography>{" "}
          Donations
        </Typography>
      </Box>
    </Card>
  );
};

export default CampaignCard;
