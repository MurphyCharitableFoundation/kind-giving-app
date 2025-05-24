import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box } from "@mui/material";

import TextContent from "../components/TextContent";
import TopBar from "../components/TopBar";
import Cause from "../../../interfaces/Cause";
import { getCauseById } from "../../../utils/endpoints/causesEndpoints";
import HeaderTitles from "../components/HeaderTitles";
import theme from "../../../theme/theme";
import NotFoundPage from "../../NotFound/NotFound";

const UpperDivsStyles = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const CauseDetails = () => {
  const { causeId } = useParams<{ causeId: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>();

  const [currentCause, setCurrentCause] = useState<Cause | null>(null);

  useEffect(() => {
    const getListItemsAPI = async () => {
      try {
        setIsLoading(true);

        const response = await getCauseById(causeId!);

        setCurrentCause(response);
      } catch (err: any) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    getListItemsAPI();
  }, [causeId]);

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
      <TopBar isCreating={false}>
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
          {error}
        </Box>
      )}
    </>
  );
};

export default CauseDetails;
