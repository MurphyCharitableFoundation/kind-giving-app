import { useParams } from "react-router-dom";
import CreateOrEditCause from "../components/CreateOrEditCause";
import TopBar from "../components/TopBar";
import { useGetCauseById } from "../../../hooks/useGetCauseById";
import { Box } from "@mui/material";

const EditCause = () => {
  const { causeId } = useParams<{ causeId: string }>();

  const { isLoading, currentCause } = useGetCauseById(causeId!);

  if (isLoading) {
    return (
      <Box>
        {/* Placeholder for our spinner if we decide to use one */}
        Loading...
      </Box>
    );
  }

  return (
    <>
      <TopBar isCreating={false} isEditing={true} causeId={causeId}>
        Edit Cause
      </TopBar>

      <CreateOrEditCause
        isCreating={false}
        initialData={currentCause}
        causeId={causeId}
      />
    </>
  );
};

export default EditCause;
