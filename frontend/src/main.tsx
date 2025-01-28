import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import routes from "./routes";
import { GoogleOAuthProvider } from "@react-oauth/google";

const router = createBrowserRouter(routes);
const googleClientId: string = import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID;

createRoot(document.getElementById("root")!).render(
	<GoogleOAuthProvider clientId={googleClientId}>
		<StrictMode>
			<RouterProvider router={router} />
		</StrictMode>
	</GoogleOAuthProvider>,
);
