import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@mui/material";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import theme from "./theme/theme";
import routes from "./routes";
import "./index.css";

// Google config
const googleClientId: string = import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID;

// React-query config
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

// Router config
const router = createBrowserRouter(routes);

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={googleClientId}>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <StrictMode>
          <RouterProvider router={router} />
        </StrictMode>
      </ThemeProvider>
    </QueryClientProvider>
  </GoogleOAuthProvider>
);
