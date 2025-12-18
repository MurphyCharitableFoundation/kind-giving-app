import React, { useState } from "react";
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { Typography, Box, Card, Collapse } from "@mui/material";
import DropdownSection from "../../../interfaces/UserProfile";
import theme from "../../../theme/theme";
interface DropdownSectionProps {
  section: DropdownSection;
}
const DropdownMenu: React.FC<DropdownSectionProps> = ({ section }) => {
  const [open, setOpen] = useState(false);

  return (

    <Box sx={{ bgcolor: theme.custom.surfaceContainer.lowest ,
      overflow:"visible"
    }}
    >
      <Card
        sx={{
          bgcolor: open ? theme.palette.secondary.container : theme.custom.surfaceContainer.low,
          // bgcolor:"red",

borderRadius:"12px",
          cursor: "pointer", borderBottomLeftRadius: open ? 0 : '12px',
          borderBottomRightRadius: open ? 0 : '12px',

          padding: "16px", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center"
        }}

        onClick={() => setOpen(!open)}>
        <Box sx={{
          display: 'flex', alignItems: 'center',
           gap: "16px",
        }}


        >
          {section.icon}
          <Typography color={section.isDanger ? 'error' : 'text.primary'}>
            {section.title}
          </Typography>
        </Box>
        <Box sx={{
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.3s ease',
        }}>
          {section.arrowDown && <KeyboardArrowDownRoundedIcon />}
        </Box>
      </Card>

      <Collapse in={open}>
        {/* <Box sx={{ border: "none",
          width:"100%",
          height:"auto",
          overflow:"visible",
          borderRadius:"12px",
          bgcolor:"green"
         }}> */}
          {section.children}
        {/* </Box> */}
      </Collapse>

    </Box>
  );
};

export default DropdownMenu;
