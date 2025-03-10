import { logout } from "../utils/endpoints";
import { googleLogout } from "@react-oauth/google";
import { Button,  } from "@mui/material";
import theme from "../theme/theme";
import Typography from "@mui/material/Typography";


const LogoutButton = () => {
  const logOut = async () => {
    try {
      googleLogout();
      await logout();
      console.log("User logged out successfully");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  
  return (
    <>
      <Button 
        onClick={logOut} 
        sx={{ backgroundColor: theme.palette.primary.onContainer }}
      >
        Logout
      </Button>
         < Typography variant="headlineSmallTextRegular" sx={{color: theme.palette.primary.fixedDim}}>
     Display headlineSmallTextRegular
     </Typography>
    </>
  );
};

export default LogoutButton;
