import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import routes from "./routes";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ThemeProvider } from "@mui/material";
import theme from "./theme/theme";

const router = createBrowserRouter(routes);
const googleClientId: string = import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID;

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={googleClientId}>
    <ThemeProvider theme={theme}>
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
    </ThemeProvider>
  </GoogleOAuthProvider>
);
