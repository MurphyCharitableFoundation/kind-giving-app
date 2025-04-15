import { Box, Typography } from "@mui/material";
import Navbar from "../../components/Navbar/Navbar";
import theme from "../../theme/theme";

import NewItemButton from "../../components/NewItemButton/NewItemButton";
import SearchBar from "../../components/SearchBar/SearchBar";
import { useEffect, useState } from "react";
import Cause from "../../interfaces/Cause";
import { getCauses } from "../../utils/axios";

const Causes = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [causes, setCauses] = useState<Cause[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCausesAPI = async () => {
      try {
        setIsLoading(true);
        const response = await getCauses();
        setCauses(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCausesAPI();
  }, []);

  if (isLoading) {
    return (
      <Box>
        {/* Placeholder for our spinner if we decide to use one */}
        Loading...
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <Navbar>Causes</Navbar>

      {/* main section container */}
      <Box
        sx={{
          bgcolor: {
            xs: theme.custom.surface.main,
          },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "15px",
          flexGrow: 1,
          gap: "16px",
        }}
      >
        {/* Search bar */}
        <SearchBar />

        {/* New Cause button */}
        <NewItemButton>New Cause</NewItemButton>

        {/* Causes to be displayed */}
        {causes.map((cause) => (
          <Box
            key={cause.id}
            sx={{
              display: "flex",
              gap: "10px",
              padding: "10px",
              border: `1px solid ${theme.custom.misc.outlineVariant}`,
              width: "100%",
              maxWidth: "318px",
              height: "100px",
              borderRadius: "12px",
              bgcolor: theme.custom.surfaceContainer.lowest,
            }}
          >
            {/* icon div */}
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
              {cause.icon || "🌍"}
            </Box>

            {/* text div */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                width: "100%",
                maxWidth: "208px",
                height: "78px",
              }}
            >
              <Typography
                variant="titleLargetextSemiBold"
                sx={{ color: theme.custom.surface.onColor }}
              >
                {/* capitalized name */}
                {cause.name.charAt(0).toUpperCase() + cause.name.slice(1)}
              </Typography>
              <Typography>{cause.description}</Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Causes;
