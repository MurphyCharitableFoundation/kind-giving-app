import { ChangeEvent, useState } from "react";
import TopBar from "../components/TopBar";
import CreateOrEditCause from "../components/CreateOrEditCause";



const CreateCause = () => {


  return (
    <>
      <TopBar isCreating={true}>Create a cause</TopBar>

      <CreateOrEditCause />
    </>
  );
};

export default CreateCause;
