import { Card , Button, Typography} from "@mui/material";
import theme from "../../../theme/theme";
const LogOutPopUp: React.FC = () =>{


    return(
        <Card>
<Button 
                  variant="outlined"
                  sx={{
                        borderColor: theme.palette.primary.main, textTransform: 'none',
                        paddingY: '10px', paddingX: "12px", borderRadius: "24px",width:"100%"

                    }}>  <Typography sx={{ color: theme.palette.primary.main }}>
                            Change
                        </Typography></Button>

                          <Button
                          variant="outlined"
                          sx={{
                        borderColor: theme.status.error.main, textTransform: 'none',
                        paddingY: "10px", paddingX: "12px", borderRadius: "24px", width:"100%"

                    }}>  <Typography sx={{ color: theme.status.error.main }}>
                            Remove
                        </Typography></Button>

        </Card>
    )
}

export default LogOutPopUp;