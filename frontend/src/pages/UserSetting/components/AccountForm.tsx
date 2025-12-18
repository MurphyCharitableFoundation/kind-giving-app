import { Typography, Container, Card, TextField, Button, Box } from "@mui/material";
import { ChangeEvent, FormEvent, useState } from "react";
import EmailInput from "../../../components/EmailInput";
import theme from "../../../theme/theme";

interface AccountForm {
    firstName: string;
    lastName: string;
    email: string;
    phoneNum: string;
    aboutMe: string
}
interface AccountErrors {
    firstName: string;
    lastName: string;
    email: string;
    phoneNum: string;
    aboutMe: string
}
const AccountForm: React.FC = () => {


    const [accountData, setAccountData] = useState<AccountForm>({
        firstName: "", lastName: "", phoneNum: "", email: "", aboutMe: ""
    });

    const [errors, setAccountErrors] = useState<AccountErrors>({
        firstName: "", lastName: "", phoneNum: "", email: "", aboutMe: ""
    });

    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    //Handles input changes
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        setAccountData({
            ...accountData,
            [name]: value
        });

        setAccountErrors(
            {
                ...errors,
                [name]: "",
            }
        )
    };

    const validateAccount = () => {
        const newErrors: AccountErrors = {
            firstName: "", lastName: "", phoneNum: "", email: "", aboutMe: ""
        }
        const phoneRegex = /^\(\d{3}\)\s\d{3}-\d{4}$/;
        //validate first name
        let isValid = true;
        if (!accountData.firstName) {
            newErrors.firstName = "First Name is required.";
            isValid = false;
        };
        //validate last name
        if (!accountData.lastName) {
            newErrors.lastName = "Last Name is required.";
            isValid = false;
        };

        //Validate email
        if (!accountData.email) {
            newErrors.email = "Email is required.";
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(accountData.email)) {
            newErrors.email = "Invalid email address.";
            isValid = false
        }
        //validate Phone Number
        if (!accountData.phoneNum) {
            newErrors.phoneNum = "Phone Number is required."
        } else if (!phoneRegex.test(accountData.phoneNum)) {
            newErrors.phoneNum = "Invalid Phone Number.";
            isValid = false;
        }

        //validate about me
        if (!accountData.aboutMe) {
            newErrors.aboutMe = "About Me is required.";
            isValid = false;
        }

        setAccountErrors(newErrors);
        return isValid;
    };

    const submitAccount = async (e: FormEvent) => {
        e.preventDefault();
        if (!validateAccount()) {
            console.log("Got error!");
            return;
        }

        try {
            console.log("Got it!");
        } catch (error: any) {
            console.log("Submission error: ", error)
        }

        finally {

            console.log("Finished submit attempt")

        }

    }
    return (
 
            <Card
                component={"form"}
                onSubmit={submitAccount}
                sx={{

                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                    width: "100%",
                    borderTopRightRadius:0,
                    borderTopLeftRadius:0,
                    borderBottomLeftRadius:"12px",
                    borderBottomRightRadius: "12px",
                    paddingTop: "16px",
                    paddingX: "24px",
        

                }}
            >
                <TextField

                    name="firstName"
                    label="First Name"
                    value={accountData.firstName}
                    onChange={handleInputChange}
                    error={errors.firstName ? true : false}
                    helperText={errors.firstName}
                />

                <TextField
                    name="lastName"
                    label="Last Name"
                    onChange={handleInputChange}
                    error={errors.lastName ? true : false}
                    helperText={errors.lastName}
                />

                <EmailInput
                    name="email"
                    value={accountData.email}
                    onChange={handleInputChange}
                    error={errors.email ? true : false}
                    helperText={errors.email}
                />

                <TextField
                    name="phoneNum"
                    label="Phone Number"
                    value={accountData.phoneNum}
                    onChange={handleInputChange}
                    error={errors.phoneNum ? true : false}
                    helperText={errors.phoneNum}
                />

                <TextField
                    name="aboutMe"
                    label="About Me"
                    rows={2}
                    multiline
                    value={accountData.aboutMe}
                    onChange={handleInputChange}
                    error={errors.aboutMe ? true : false}
                    helperText={errors.aboutMe}
                />

                <Box sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "11px",

                    justifyContent: "center",
                    marginBottom: "24px",
                    width: "100%",
                    height: "40px",
                    paddingY: "4px"
                }}>
                    <Button sx={{
                        bgcolor: theme.palette.primary.container, textTransform: 'none',
                        paddingY: '10px', paddingX: "24px", borderRadius: "24px", width: "100%", height: "32px",

                    }}>  <Typography sx={{ color: theme.palette.primary.main }}>
                            Cancel
                        </Typography></Button>
                    <Button sx={{
                        bgcolor: theme.palette.primary.main, textTransform: 'none'
                        , paddingY: '10px', paddingX: "24px", borderRadius: "24px", width: "100%", height: "32px"

                    }} type="submit">

                        <Typography sx={{ color: theme.palette.primary.onColor }}>
                            Save
                        </Typography></Button>
                </Box>
            </Card>
  
    );
}
export default AccountForm;