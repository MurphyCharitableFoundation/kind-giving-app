import theme from "../../theme/theme";
import EditButton from "./components/EditButton";
import DeleteButton from "./components/DeleteButton";
import Navbar from "../../components/Navbar/Navbar";
import NewItemButton from "../../components/NewItemButton/NewItemButton";
import SearchBar from "../../components/SearchBar/SearchBar";

import { Box, Typography } from "@mui/material";
import { MouseEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetCauses } from "../../hooks/useGetCauses";
import { useDeleteCause } from "../../hooks/useDeleteCause";
import Modal from "../../components/DeleteModal/Modal";
import Cause from "../../interfaces/Cause";

const Causes = () => {
  const navigate = useNavigate();

  const [causeClickedId, setCauseClickedId] = useState<number | null>(null);
  const [selectedCause, setSelectedCause] = useState<Cause | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalHeaderText] = useState<string>("Delete Cause");
  const [modalBodyMessage, setModalBodyMessage] = useState<string>(
    "Are you sure you want to delete this cause?"
  );

  const { data: causes, isLoading, error } = useGetCauses();
  const deleteCauseMutation = useDeleteCause();

  const handleClickedCause = (causeId: number) => {
    if (causeClickedId && causeId === causeClickedId) {
      navigate(`/causes/${causeId}`);
      return;
    }

    setCauseClickedId(causeId);
  };

  const handleNewCauseBtn = () => {
    navigate("/causes/create");
  };

  const handleEditCauseBtn = (e: MouseEvent<HTMLButtonElement>, id: number) => {
    e.stopPropagation();

    navigate(`/causes/${id}/edit`);
  };

  // pass a custom text for the body message if you want
  const handleDeleteCauseBtn = (
    e: MouseEvent<HTMLButtonElement>,
    cause: Cause
  ) => {
    e.stopPropagation();

    setSelectedCause(cause);

    setModalBodyMessage(
      `Are you sure you want to delete the cause ${cause.name.charAt(0).toUpperCase() + cause.name.slice(1)}?`
    );

    setIsModalOpen(true);
  };

  const handleDeleteCauseDefinitely = async () => {
    if (!selectedCause) return;

    try {
      await deleteCauseMutation.mutateAsync({
        id: selectedCause.id,
      });
      setIsModalOpen(false);
      setSelectedCause(null);
      setCauseClickedId(null);
    } catch (error) {
      console.error("Failed to delete cause:", error);
    }
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
      <Modal
        headerText={modalHeaderText}
        bodyText={modalBodyMessage}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        handleDelete={handleDeleteCauseDefinitely}
      />

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
          gap: "16px",
          height: "calc(100vh - 70px)",
          overflow: "auto",
        }}
      >
        {/* Search bar */}
        <SearchBar />

        {/* New Cause button */}
        <NewItemButton onClick={handleNewCauseBtn}>New Cause</NewItemButton>

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
                borderRadius: "12px",
                bgcolor: theme.custom.surfaceContainer.lowest,
                boxShadow: causeClickedId === cause.id ? 4 : 0,
                flexShrink: 0,
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
                  <EditButton
                    onClick={(e) => handleEditCauseBtn(e, causeClickedId)}
                  >
                    Edit
                  </EditButton>

                  <DeleteButton onClick={(e) => handleDeleteCauseBtn(e, cause)}>
                    Delete
                  </DeleteButton>
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
