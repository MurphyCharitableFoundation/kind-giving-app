import { Box, Button, Typography } from "@mui/material";
import Navbar from "../../components/Navbar/Navbar";
import theme from "../../theme/theme";

import NewItemButton from "../../components/NewItemButton/NewItemButton";
import SearchBar from "../../components/SearchBar/SearchBar";
import { useEffect, useState } from "react";
import Cause from "../../interfaces/Cause";
import { getCauses } from "../../utils/axios";
import EditButton from "./components/EditButton";
import DeleteButton from "./components/DeleteButton";

const Causes = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [causes, setCauses] = useState<Cause[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [causeClickedId, setCauseClickedId] = useState<number | null>(null);

  const handleClickedCause = (CauseId: number) => {
    if (causeClickedId && CauseId === causeClickedId) {
      setCauseClickedId(null);
      return;
    }

    setCauseClickedId(CauseId);
  };

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
              flexDirection: "column",
              gap: "10px",
              padding: "10px",
              border: `1px solid ${theme.custom.misc.outlineVariant}`,
              width: "100%",
              maxWidth: "318px",
              minHeight: "100px",
              borderRadius: "12px",
              bgcolor: theme.custom.surfaceContainer.lowest,
              boxShadow: causeClickedId === cause.id ? 3 : 0,
            }}
            onClick={() => handleClickedCause(cause.id)}
          >
            {/* Icon and Text div container */}
            <Box
              sx={{
                display: "flex",
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
                  sx={{
                    color: theme.custom.surface.onColor,
                    fontWeight: "bold",
                  }}
                >
                  {/* capitalized name */}
                  {cause.name.charAt(0).toUpperCase() + cause.name.slice(1)}
                </Typography>

                <Typography
                  variant="bodySmall"
                  sx={{
                    color: theme.custom.surface.onColor,
                  }}
                >
                  {cause.description}
                </Typography>
              </Box>
            </Box>

            {/* Edit and Delete buttons div */}
            {causeClickedId && causeClickedId === cause.id && (
              <Box
                sx={{
                  display: "flex",
                  gap: "10px",
                  width: "100%",
                  justifyContent: "center",
                  position: "relative",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: "5%",
                    width: "90%",
                    height: "1px",
                    backgroundColor: theme.custom.misc.outlineVariant,
                  },

                  paddingTop: "10px",
                }}
              >
                <EditButton>Edit</EditButton>

                <DeleteButton>Delete</DeleteButton>
              </Box>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Causes;
