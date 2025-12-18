import { useState } from "react";
import { useRef } from "react";
import { Typography, Container, Card, TextField, Button, Box } from "@mui/material";
import AvatarEditor from "react-avatar-editor";
import type { ComponentType } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { MoreVert } from "@mui/icons-material";
import theme from "../../../theme/theme";
import CloseIcon from "../../../assets/close.svg";
const ProfilePicture: React.FC = () => {

    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [editor, setEditor] = useState<AvatarEditor | null>(null);
    const [uploadImage, setUploadImage] = useState<string>("");
const editorRef = useRef<any>(null);
    // const handleFileChange = 

    return (
        <Card
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,

                width: "100%",

                bgcolor: "grey",
                paddingBottom: "64px",

            }}>
            <Box sx={{
                display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center",
                height: "100%", padding: "24px", bgcolor: "white"
            }}>
                <ArrowBackIcon />
                <Typography sx={{ flexGrow: 1, textAlign: "left", ml: 2, font: theme.typography.titleXLargetextMedium }}>
                    User Settings
                </Typography>
                <Box
                    sx={{
                        bgcolor: theme.palette.primary.container,
                        borderRadius: "50%",
                        width: 40,
                        height: 40,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <MoreVert />
                </Box>
            </Box>


            <Card sx={{
                width: "100%",
                // borderRadius:"5%",
                borderTopLeftRadius: "12px",
                borderTopRightRadius: "12px",
                paddingBottom: "20px",
                // margin:"auto",
                marginTop: "32px",
                bgcolor: "white"
            }}>
                <Box
                    sx={{
                        display: "flex", justifyContent: "row", padding: "24px",
                        width: "100%", gap: "auto", alignItems: "center"


                    }}
                >

                    <Typography sx={{ flexGrow: 1, textAlign: "left", ml: 2, font: theme.typography.titleXLargetextMedium }}>
                        Edit Profile Picture
                    </Typography>
                    <Box sx={{ width: "20px", height: "20px" }}>
                        <img src={CloseIcon} alt="close-icon" /></Box>
                </Box>


                <Box

                    sx={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "grey",
                        paddingY: "32px",
                        minHeight: "310px"
                    }}>
                    <input type="file"
                        // ref={fileInputRef}
                        accept="image/*"
                        onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                setProfileImage(e.target.files[0])
                            }
                        }}
                    />

                    <Box sx={{
                        width: "100%"

                    }}>

                        {profileImage && (

                            
                            <AvatarEditor
                                // ref={(ref) => setEditor(ref)}
                                ref={editorRef}
                                image={profileImage}
                                width={350} height={350}

                                borderRadius={160} scale={1.2}


                            />
                        )}</Box>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", gap: "60px", paddingX: "24px", paddingY: "32px" }}>
                    <Button
                        variant="outlined"
                        sx={{
                            borderColor: theme.palette.primary.main, textTransform: 'none',
                            paddingY: '10px', paddingX: "12px", borderRadius: "24px", width: "100%"

                        }}>  <Typography sx={{ color: theme.palette.primary.main }}>
                            Change
                        </Typography></Button>

                    <Button
                        variant="outlined"
                        sx={{
                            borderColor: theme.status.error.main, textTransform: 'none',
                            paddingY: "10px", paddingX: "12px", borderRadius: "24px", width: "100%"

                        }}>  <Typography sx={{ color: theme.status.error.main }}>
                            Remove
                        </Typography></Button></Box>
            </Card>
        </Card>
    )
}

export default ProfilePicture;