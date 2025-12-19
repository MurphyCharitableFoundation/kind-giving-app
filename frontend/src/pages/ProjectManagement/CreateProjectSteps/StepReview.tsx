import React, { useEffect } from "react";
import { StepProps } from "../../../components/MultiStepForm";
import { Box, Container, IconButton, Typography } from "@mui/material";
import theme from "../../../theme/theme";
import ProjectImagesCarousel from "../../../components/ProjectImagesCarousel";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { CreateProjectFormData } from "./CreateProjectFormData";

const StepReview: React.FC<StepProps<CreateProjectFormData>> = ({
  data,
}) => {
  useEffect(() => {
    console.log(data)
  }, [])


  return (
    <Container sx={{ padding: 0 }}>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>

        {/* Project Name */}
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <Typography
            color={theme.palette.primary.main}
            variant='bodyXSmall'
          >
            Name
          </Typography>
          <Typography
            color={theme.custom.surface.onColor}
            variant="titleXLargetextMedium"
          >
            {data.name}
          </Typography>
        </Box>

        {/* Project Causes */}
        <Box
          sx={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap'
          }}
        >
          {data.causes.map((cause) => (<>
            <Box
              sx={{
                backgroundColor: theme.palette.primary.container,
                borderRadius: '8px',
                px: '16px',
                py: '6px',
                display: 'inline-flex',
              }}
            >
              <Typography variant='labelLarge' color={theme.palette.primary.main}>
                {cause.name}
              </Typography>
            </Box>
          </>
          ))}
        </Box>

        {/* Project Description */}
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <Typography
            color={theme.palette.primary.main}
            variant='bodyXSmall'
          >
            Description
          </Typography>
          <Typography
            color={theme.custom.surface.onColor}
            variant='bodySmall'
          >
            {data.description}
          </Typography>
        </Box>

        {/* Project Details */}
        {/* TODO -> Should create a component here, so much copy and paste code */}
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}
        >

          <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: '8px'
          }}
          >
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'start',
              gap: '32px',
              p: '16px',
              backgroundColor: theme.custom.surface.variant,
              borderRadius: '16px',
              border: 'solid',
              borderWidth: '1px',
              borderColor: theme.custom.misc.outlineVariant,
              width: '168px',
              height: '124px',
              overflow: 'hidden'
            }}
            >
              <Typography variant='bodyMedium' color={theme.custom.surface.onColor}>Target Funds</Typography>
              <Typography variant='headlineMediumTextRegular' color={theme.palette.primary.main}>{data.target}$</Typography>
            </Box>

            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'start',
              gap: '32px',
              p: '16px',
              backgroundColor: theme.custom.surface.variant,
              borderRadius: '16px',
              border: 'solid',
              borderWidth: '1px',
              borderColor: theme.custom.misc.outlineVariant,
              width: '168px',
              height: '124px',
              overflow: 'hidden'
            }}
            >
              <Typography variant='bodyMedium' color={theme.custom.surface.onColor}>Campaign Limit</Typography>
              <Typography variant='headlineMediumTextRegular' color={theme.palette.primary.main}>{data.campaign_limit}</Typography>
            </Box>

          </Box>

          <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: '8px'
          }}>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'start',
              gap: '32px',
              p: '16px',
              backgroundColor: theme.custom.surface.variant,
              borderRadius: '16px',
              border: 'solid',
              borderWidth: '1px',
              borderColor: theme.custom.misc.outlineVariant,
              width: '168px',
              height: '124px',
              overflow: 'hidden'
            }}
            >
              <Typography variant='bodyMedium' color={theme.custom.surface.onColor}>Country</Typography>
              <Typography variant='headlineMediumTextRegular' color={theme.palette.primary.main}
                sx={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '100%',
                  display: 'block',
                }}>
                {data.country}
              </Typography>
            </Box>

            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'start',
              gap: '32px',
              p: '16px',
              backgroundColor: theme.custom.surface.variant,
              borderRadius: '16px',
              border: 'solid',
              borderWidth: '1px',
              borderColor: theme.custom.misc.outlineVariant,
              width: '168px',
              height: '124px',
            }}
            >
              <Typography variant='bodyMedium' color={theme.custom.surface.onColor}>City</Typography>
              <Typography variant='headlineMediumTextRegular' color={theme.palette.primary.main}
                sx={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '100%',
                  display: 'block',
                }}>
                {data.city}
              </Typography>
            </Box>

          </Box>
        </Box>

        {/* Project Beneficiaries */}
        {/* TODO -> Mapping for beneficiaries*/}
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <Typography
            color={theme.palette.primary.main}
            variant='bodyXSmall'
          >
            Beneficiaries
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <Box
              sx={{
                py: '16px',
                px: '14px',
                width: '100%',
                border: 'solid',
                borderRadius: '4px',
                borderWidth: '1px',
                borderColor: theme.custom.misc.outline
              }}
            >
              <Typography variant='bodySmall' color={theme.custom.surface.onColor}>Women Loan Supporters</Typography>
            </Box>
          </Box>
        </Box>

        {/* Project Images */}
        <Typography
          color={theme.palette.primary.main}
          variant="titleXSmalltextMedium"
        >
          Images
        </Typography>
        <ProjectImagesCarousel />

      </Box>
    </Container>
  );
};

export default StepReview;
