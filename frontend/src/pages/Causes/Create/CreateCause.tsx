import TopBar from "../components/TopBar";
import CreateOrEditCause from "../components/CreateOrEditCause";

const CreateCause = () => {
  return (
    <>
      <TopBar isCreating={true}>Create a cause</TopBar>

      <CreateOrEditCause isCreating={true} />
    </>
  );
};

export default CreateCause;
