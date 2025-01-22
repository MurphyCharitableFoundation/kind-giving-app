import { Link as RouterLink } from "react-router-dom";
import notFoundImage from "../../assets/images/404notfound.jpg";
import { Box, Container, Link, Typography } from "@mui/material";

const NotFoundPage = () => {
  return (
    <Container sx={{ display: "flex", justifyContent: "center" }}>
      <Box
        sx={{
          marginTop: "48px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "24px",
        }}
      >
        <Box
          component={"img"}
          src={notFoundImage}
          alt="Cat trying to get a ball in a bowl"
          sx={{
            height: {
              xs: 200,
              sm: 300,
            },
            maxWidth: "100%",
            objectFit: "contain",
          }}
        />
        <Typography variant="h5">
          We can't seem to find the page you're looking for.
        </Typography>
        <Typography variant="body1">
          Back to{" "}
          <Link sx={{ textDecoration: "underline", color: "inherit" }}>
            <RouterLink to="/">Homepage</RouterLink>
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default NotFoundPage;
