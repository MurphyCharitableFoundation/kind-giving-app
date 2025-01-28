import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Container, Typography } from "@mui/material";
import { confirmEmail } from "../../utils/endpoints";

const EmailConfirm: React.FC = () => {
	const { key } = useParams<{ key: string }>();
	const navigate = useNavigate();
	const [status, setStatus] = useState<string>("Verifying your email...");
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const handleHomeRedirect = () => {
			navigate("/");
		};

		const verifyEmail = async () => {
			if (!key) {
				setError("Invalid verification key.");
				setStatus("");
				return;
			}

			try {
				await confirmEmail(key);
				setStatus("Your email has been successfully verified!");
				handleHomeRedirect();
			} catch (err: any) {
				setError(err);
			}
		};

		verifyEmail();
	}, [key, navigate]);

	return (
		<Container
			sx={{
				paddingY: 3,
				display: "flex",
				justifyContent: "center",
			}}
		>
			<Card
				sx={{
					display: "flex",
					flexDirection: "column",
					gap: 3,
					minWidth: "200px",
					maxWidth: "400px",
					bgcolor: "#f3f3f3",
					padding: 4,
					borderRadius: "10px",
				}}
			>
				<Typography variant="h3" sx={{ textAlign: "center" }}>
					Email Confirmation
				</Typography>
				<Typography variant="caption" gutterBottom>
					{status && <p style={{ color: "green" }}>{status}</p>}
				</Typography>
				<Typography variant="caption" gutterBottom>
					{error && <p style={{ color: "red" }}>{error}</p>}
				</Typography>
			</Card>
		</Container>
	);
};

export default EmailConfirm;
