import { logout } from "../utils/endpoints";
import { Button } from "@mui/material";

const LogoutButton = () => {
	return <Button onClick={logout}>Logout</Button>;
};

export default LogoutButton;
