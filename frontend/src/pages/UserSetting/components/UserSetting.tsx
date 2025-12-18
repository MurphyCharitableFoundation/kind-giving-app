import React, { useState } from "react";
import { Link } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {Typography, Box, Card } from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import LogoutIcon from "@mui/icons-material/Logout";
import PaymentIcon from '@mui/icons-material/Payment';
import theme from "../../../theme/theme";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import PasswordIcon from '@mui/icons-material/Password';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import userProfilePic from "../../../assets/UserIcon.svg";
import EditIcon from "../../../assets/EditIcon.svg";
import DropdownMenu from "./DropdownMenu";
import DropdownSection from "../../../interfaces/UserProfile";
import AccountForm from "../../UserSetting/components/AccountForm";
import PasswordResetForm from "../../UserSetting/components/PasswordResetForm";
import ProfilePicture from "./ProfilePicture";
import LogOutPopUp from "./LogOutPopUp";
const sections: DropdownSection[] = [
  {
    title: 'Account',
    icon: <PersonOutlineRoundedIcon sx={{ fontSize: "24px", color: theme.palette.primary.main }} />,
    children: <AccountForm />,
    arrowDown: true
  },
  {
    title: 'Password Reset',
    icon: <PasswordIcon sx={{ fontSize: "24px", color: theme.palette.primary.main }} />,
    children: <PasswordResetForm />,
    arrowDown: true
  },
  {
    title: 'Bank Account',
    icon: <PaymentIcon sx={{ fontSize: "24px", color: theme.palette.primary.main }} />,
    children: <></>,
    arrowDown: true
  },
  {
    title: 'Help',
    icon: <HelpOutlineIcon sx={{ fontSize: "24px", color: theme.palette.primary.main }} />,
    children: <></>,
    arrowDown: true
  },
  {
    title: 'Logout',
    icon: <LogoutIcon sx={{ fontSize: "24px", color: theme.palette.primary.main }} />,
    children: <LogOutPopUp/>,
    // content: null,
  },
  {
    title: 'Delete Account',
    icon: <LogoutIcon sx={{ fontSize: "24px", color: theme.status.error.main }} />,
    children: <></>,
    isDanger: true,
  },

];


const UserSetting: React.FC = () => {
  const [showProfileEditor, setShowProfileEditor] = useState(false);

  return (

    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        padding: "24px",
        paddingTop: "16px",
        paddingBottom: "64px",
 margin: "auto"

      }}
    >
      <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
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
      <Link to="/user/user-profile">
      <Box sx={{ display: "flex", justifyContent: "left", alignItems: "flex-end" }}>


        <Box 
        onClick ={() => setShowProfileEditor(true)}
        sx={{ bgcolor: theme.palette.secondary.fixedDim, width: "77px", height: "77px", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <img src={userProfilePic} alt="user-profile" />
        </Box>
        <Box sx={{
          bgcolor: theme.palette.primary.main, width: 32, height: 32, borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center",
          position: "relative", left: "-15px"
        }}>

          <img src={EditIcon} alt="Edit-Icon" />
        </Box>
        {/* {showProfileEditor && (<ProfilePicture 
      onClick ={() => setShowProfileEditor(false)} />)} */}
      </Box>
</Link>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>


        <Typography sx={{ flexGrow: 1, textAlign: "left", ...theme.typography.titleLargetextSemiBold }}>
          Brain May
        </Typography>
        <Box sx={{
          width: "fit-content", textAlign: "center", alignItems: "center", backgroundColor: theme.palette.tertiary?.container, borderRadius: "32px",
          paddingY: "8px", paddingX: "16px"
        }}>
          <Typography sx={{ flexGrow: 1, textAlign: "center", color: theme.palette.tertiary?.main, }}>
            Lender
          </Typography>
        </Box>
      </Box>
      <Typography sx={{ flexGrow: 1, textAlign: "left", ...theme.typography.bodyMedium }}>
        I’m from Netherlands and I like funding for pottery, clothing and medical.
      </Typography>

      {sections.map((section, index) => (
        <DropdownMenu key={index} section={section} />

      ))}
    </Card>


  );
};

export default UserSetting;
