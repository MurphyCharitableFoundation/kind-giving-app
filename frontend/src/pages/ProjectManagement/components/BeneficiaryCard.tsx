import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";
import React from "react";
import theme from "../../../theme/theme";
import projectImage from "../../../assets/images/project-image-sample.png";
import { ProjectBeneficiary } from "../../../utils/projectsEndpoints";

interface BeneficiaryProps {
  assignment: ProjectBeneficiary;
}

const BeneficiaryCard: React.FC<BeneficiaryProps> = ({ assignment }) => {
  return (
    <Card
      elevation={0}
      sx={{
        display: "flex",
        padding: "8px",
        border: 1,
        borderColor: theme.custom.misc.outlineVariant,
        borderRadius: "16px",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <CardMedia
          sx={{ width: "94px", height: "100px", borderRadius: "16px" }}
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
              {assignment.beneficiary.name}
            </Typography>
            {/* Beneficiaries interests (group) | Beneficiaries email (individual) */}
            {assignment.assignable_type == "UserGroup" && (
              <Typography
                color={theme.custom.surface.onColorVariant}
                variant="bodySmall"
              >
                Interests:{" "}
                <Typography
                  component="span"
                  color={theme.custom.surface.onColorVariant}
                  variant="bodySmall"
                >
                  {assignment.beneficiary.interest}
                </Typography>
              </Typography>
            )}
            {assignment.assignable_type == "User" && (
              <Typography
                component="span"
                color={theme.custom.surface.onColorVariant}
                variant="bodySmall"
              >
                {assignment.beneficiary.email}
              </Typography>
            )}
            {/* Amount disbursed to beneficiary */}
            <Typography
              color={theme.custom.surface.onColorVariant}
              variant="bodySmall"
            >
              Disbursed:{" "}
              <Typography
                component="span"
                color={theme.status.success.main}
                fontWeight="bold"
                variant="bodyLarge"
              >
                $75.00
              </Typography>
            </Typography>
          </Box>
        </CardContent>
      </Box>
    </Card>
  );
};

export default BeneficiaryCard;
