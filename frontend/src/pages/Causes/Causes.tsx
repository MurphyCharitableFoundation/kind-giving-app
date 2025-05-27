import theme from "../../theme/theme";
import EditButton from "./components/EditButton";
import DeleteButton from "./components/DeleteButton";
import Navbar from "../../components/Navbar/Navbar";
import NewItemButton from "../../components/NewItemButton/NewItemButton";
import SearchBar from "../../components/SearchBar/SearchBar";

import { Box, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetCauses } from "../../hooks/useGetCauses";

const Causes = () => {
  const navigate = useNavigate();

  const [causeClickedId, setCauseClickedId] = useState<number | null>(null);

  const { data: causes, isLoading, error } = useGetCauses();

  const handleClickedCause = (causeId: number) => {
    if (causeClickedId && causeId === causeClickedId) {
      navigate(`/causes/${causeId}`);
      return;
    }

    setCauseClickedId(causeId);
  };

  const handleCreateCause = () => {
    navigate("/causes/create");
  };

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
          minHeight: "calc(100vh - 70px)",
        }}
      >
        {/* Search bar */}
        <SearchBar />

        {/* New Cause button */}
        <NewItemButton onClick={handleCreateCause}>New Cause</NewItemButton>

        {!causes && (
          <Typography variant="h3" sx={{ textAlign: "center" }}>
            There are no causes registered yet.
          </Typography>
        )}

        {/* Causes to be displayed */}
        {causes &&
          causes.map((cause) => (
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
                height: "fit-content",
                borderRadius: "12px",
                bgcolor: theme.custom.surfaceContainer.lowest,
                boxShadow: causeClickedId === cause.id ? 4 : 0,
              }}
              onClick={() => handleClickedCause(cause.id)}
            >
              {/* Icon and Text div container */}
              <Box
                sx={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
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
                    minHeight: "78px",
                    height: "fit-content",
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
            }}
          >
            {error.message}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Causes;
