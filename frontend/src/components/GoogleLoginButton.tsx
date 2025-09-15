import React from "react";
import { AuthenticateWithGoogle } from "../utils/endpoints/endpoints";
import { useGoogleLogin } from "@react-oauth/google";
import { Button } from "@mui/material";
import theme from "../theme/theme";
import GoogleIcon from '../assets/web_light_rd_na.svg';

const GoogleLoginButton: React.FC = () => {
  // const login = useGoogleLogin({
  //   onSuccess: async (tokenResponse) => {
  //     console.log("Access Token:", tokenResponse);
  //     await AuthenticateWithGoogle(tokenResponse.access_token);
  //   },
  //   onError: (error) => {
  //     console.error("Login Failed:", error);
  //   },
  // });

  return (
    <Button
      variant="outlined"
      disableElevation={true}
      startIcon={<img
        src={GoogleIcon}
        alt="Google logo"
        style={{ width: 28, height: 28 }}
      />}
      sx={{
        paddingY: '10px', height: "40px", borderRadius: '40px', textTransform: "none", borderColor: theme.custom.misc.outline
      }}
      // onClick={() => login()}
    >
      Sign in with Google
    </Button>
  );
};

export default GoogleLoginButton;
