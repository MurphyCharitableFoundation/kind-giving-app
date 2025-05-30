import { useParams } from "react-router-dom";
import { Box } from "@mui/material";

import TextContent from "../components/TextContent";
import TopBar from "../components/TopBar";
import HeaderTitles from "../components/HeaderTitles";
import theme from "../../../theme/theme";
import NotFoundPage from "../../NotFound/NotFound";
import { useGetCauseById } from "../../../hooks/useGetCauseById";

const UpperDivsStyles = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const CauseDetails = () => {
  const { causeId } = useParams<{ causeId: string }>();

  const { isLoading, error, currentCause } = useGetCauseById(causeId!);

  if (isLoading) {
    return (
      <Box>
        {/* Placeholder for our spinner if we decide to use one */}
        Loading...
      </Box>
    );
  }

  if (!currentCause) {
    return <NotFoundPage />;
  }

  return (
    <>
      <TopBar isCreating={false} causeId={causeId}>
        {currentCause.name.charAt(0).toUpperCase() + currentCause.name.slice(1)}
      </TopBar>

      <Box
        sx={{
          ...UpperDivsStyles,
          padding: "15px",
          gap: "16px",
        }}
      >
        {/* name div */}
        <Box sx={UpperDivsStyles}>
          <HeaderTitles>Name</HeaderTitles>

          <TextContent
            text={
              currentCause.name.charAt(0).toUpperCase() +
              currentCause.name.slice(1)
            }
          />
        </Box>

        {/* description div */}
        <Box sx={UpperDivsStyles}>
          <HeaderTitles>Description</HeaderTitles>

          <TextContent text={currentCause.description} />
        </Box>

        {/* image div */}
        <Box sx={UpperDivsStyles}>
          <HeaderTitles>Images</HeaderTitles>

          <Box
            sx={{
              width: "100%",
              bgcolor: theme.custom.surface.dim,
              height: "203px",
              maxHeight: "203px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                height: "173px",
                width: "173px",
                borderRadius: "50%",
                border: "1px solid white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {currentCause.icon || "🌍"}
            </Box>
          </Box>
        </Box>
      </Box>

      {error && (
        <Box
          sx={{
            bgcolor: "red",
            width: "100%",
            maxWidth: "318px",
            padding: "8px",
            borderRadius: "12px",
            color: "white",
            textAlign: "center",
            justifySelf: "center",
          }}
        >
          {error.message}
        </Box>
      )}
    </>
  );
};

export default CauseDetails;
