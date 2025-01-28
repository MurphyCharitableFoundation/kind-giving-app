import { Container } from "@mui/material";
import Header from "../../components/Header";
import LogoutButton from "../../components/LogoutButton";

function App() {
	return (
		<Container sx={{ height: "100vh", marginTop: "10px" }}>
			<Header />
			<LogoutButton />
		</Container>
	);
}

export default App;
