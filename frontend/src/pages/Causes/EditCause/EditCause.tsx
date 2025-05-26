import { useParams } from "react-router-dom";
import CreateOrEditCause from "../components/CreateOrEditCause";
import TopBar from "../components/TopBar";
import { useCauseById } from "../../../hooks/useCauseById";

const EditCause = () => {
  const { causeId } = useParams<{ causeId: string }>();

  const { isLoading, error, currentCause } = useCauseById(causeId!);

  return (
    <>
      <TopBar isCreating={false}>Edit</TopBar>

      <CreateOrEditCause />
    </>
  );
};

export default EditCause;
