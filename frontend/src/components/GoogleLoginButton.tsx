import React from "react";
import { AuthenticateWithGoogle } from "../utils/endpoints";
import { useGoogleLogin } from "@react-oauth/google";
import { Button } from "@mui/material";

const GoogleLoginButton: React.FC = () => {
	const login = useGoogleLogin({
		onSuccess: async (tokenResponse) => {
			console.log("Access Token:", tokenResponse);
			await AuthenticateWithGoogle(tokenResponse.access_token);
		},
		onError: (error) => {
			console.error("Login Failed:", error);
		},
	});

	return <Button onClick={login}>Login with Google</Button>;
};

export default GoogleLoginButton;
