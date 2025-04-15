import { Box } from "@mui/material";
import Navbar from "../../components/Navbar/Navbar";
import theme from "../../theme/theme";

import NewItemButton from "../../components/NewItemButton/NewItemButton";
import SearchBar from "../../components/SearchBar/SearchBar";

const Causes = () => {
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
          paddingY: "16px",
          flexGrow: 1,
          gap: "16px",
        }}
      >
        <SearchBar></SearchBar>

        {/* New Cause button */}
        <NewItemButton>New Cause</NewItemButton>
      </Box>
    </Box>
  );
};

export default Causes;
