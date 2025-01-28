import { logout } from "../utils/endpoints";
import { googleLogout } from "@react-oauth/google";
import { Button } from "@mui/material";

const LogoutButton = () => {
  const logOut = async () => {
    googleLogout();
    await logout();
  };

  return <Button onClick={logOut}>Logout</Button>;
};

export default LogoutButton;
