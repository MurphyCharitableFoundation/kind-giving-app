import { Box } from "@mui/material";
import defaultImage from "../../../assets/images/coupleCartoon.png";
import theme from "../../../theme/theme";

const DefaultCauseIcon = () => {
  return (
    <Box
      sx={{
        height: "80px",
        width: "80px",
        flexShrink: 0,
        backgroundColor: theme.palette.tertiary?.container,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        component={"img"}
        sx={{
          height: "60px",
        }}
        alt="A boy and a girl"
        src={defaultImage}
      />
    </Box>
  );
};

export default DefaultCauseIcon;
