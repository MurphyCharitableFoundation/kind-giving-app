import React, { useState, ChangeEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Container, Button, Typography, Alert } from "@mui/material";

import PasswordInput from "../../components/PasswordInput";

import { resetPasswordConfirm } from "../../utils/endpoints";

interface FormData {
	new_password1: string;
	new_password2: string;
}

interface FormErrors {
	new_password1: string;
	new_password2: string;
}

const PasswordResetConfirm: React.FC = () => {
	const { uid, token } = useParams<{ uid: string; token: string }>();
	const navigate = useNavigate();

	const [formData, setFormData] = useState<FormData>({
		new_password1: "",
		new_password2: "",
	});
	const [errors, setFormErrors] = useState<FormErrors>({
		new_password1: "",
		new_password2: "",
	});
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	const handleLoginRedirect = () => {
		navigate("/login");
	};

	const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;

		setFormData({
			...formData,
			[name]: value,
		});

		// Optionally, clear error when user starts typing
		setFormErrors({
			...errors,
			[name]: "",
		});
	};

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		try {
			await resetPasswordConfirm(
				uid,
				token,
				formData.new_password1,
				formData.new_password2,
			);
			setSuccessMessage("Your password has been reset successfully!");
			handleLoginRedirect();
		} catch (error: any) {
			setFormErrors({
				...errors,
				...error.response?.data,
			});
			setSuccessMessage("");
		}
	};

	return (
		<Container
			sx={{
				paddingY: 3,
				display: "flex",
				justifyContent: "center",
			}}
		>
			<Card
				component={"form"}
				onSubmit={handleSubmit}
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
					Reset Your Password
				</Typography>

				<PasswordInput
					name="new_password1"
					label="Password"
					value={formData.new_password1}
					onChange={handleInputChange}
					error={errors.new_password1 ? true : false}
					helperText={errors.new_password1}
				/>
				<PasswordInput
					name="new_password2"
					label="Confirm Password"
					value={formData.new_password2}
					onChange={handleInputChange}
					error={errors.new_password2 ? true : false}
					helperText={errors.new_password2}
				/>
				<Button type="submit" variant="contained" color="primary" fullWidth>
					reset password
				</Button>
				{successMessage && <Alert severity="success">{successMessage}</Alert>}
			</Card>
		</Container>
	);
};

export default PasswordResetConfirm;
