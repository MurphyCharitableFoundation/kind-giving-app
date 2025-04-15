import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import { Box, InputBase } from "@mui/material";
import theme from "../../theme/theme";

const SearchBar = () => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          borderRadius: "28px",
          padding: "16px",
          alignItems: "center",
          gap: "4px",
          bgcolor: theme.custom.surfaceContainer.high,
        }}
      >
        <FilterListIcon
          sx={{ fontSize: "24px", color: theme.custom.surface.onColor }}
        />
        <InputBase
          placeholder="Hinted search text"
          sx={{ flex: 1, paddingLeft: "16px" }}
        />
        <SearchIcon
          sx={{
            fontSize: "24px",
            marginRight: "8px",
            color: theme.custom.surface.onColorVariant,
          }}
        />
      </Box>
    </>
  );
};

export default SearchBar;
