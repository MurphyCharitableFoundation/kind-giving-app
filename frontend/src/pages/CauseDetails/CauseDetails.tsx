import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCauseById } from "../../utils/axios";
import { Box } from "@mui/material";
import Cause from "../../interfaces/Cause";

import HeaderTitles from "./components/HeaderTitles/HeaderTitles";
import TextContent from "./components/TextContent/TextContent";
import TopBar from "./components/TopBar/TopBar";

const UpperDivsStyles = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const CauseDetails = () => {
  const { causeId } = useParams<{ causeId: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentCause, setCurrentCause] = useState<Cause | null>(null);

  useEffect(() => {
    const getListItemsAPI = async () => {
      try {
        setIsLoading(true);

        const response = await getCauseById(causeId!);

        console.log(typeof response.data.description);

        setCurrentCause(response.data);
      } catch (err: any) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    getListItemsAPI();
  }, [causeId, setIsLoading]);

  if (isLoading) {
    return (
      <Box>
        {/* Placeholder for our spinner if we decide to use one */}
        Loading...
      </Box>
    );
  }

  if (!currentCause) {
    return;
  }

  return (
    <>
      <TopBar>
        {currentCause.name.charAt(0).toUpperCase() + currentCause.name.slice(1)}
      </TopBar>

      <Box
        sx={{
          padding: "15px",
          ...UpperDivsStyles,
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
          <HeaderTitles>Image</HeaderTitles>

          <Box
            sx={{
              height: "80px",
              width: "80px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {currentCause.icon || "🌍"}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default CauseDetails;
