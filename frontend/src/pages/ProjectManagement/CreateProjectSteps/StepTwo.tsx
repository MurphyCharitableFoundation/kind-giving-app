import React, { useEffect } from "react";
import { StepProps } from "../../../components/MultiStepForm";
import { Box, Button, Container, FormControl, InputAdornment, InputLabel, OutlinedInput, TextField, Typography } from "@mui/material";
import PlaceIcon from '@mui/icons-material/Place';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import AddIcon from '@mui/icons-material/Add';
import theme from "../../../theme/theme";
import { CreateProjectFormData } from "./CreateProjectFormData";

const StepTwo: React.FC<StepProps<CreateProjectFormData>> = ({
  data,
  onChange,
}) => {

  useEffect(() => {
    console.log(data)
  }, [])

  return (
    <Container sx={{ padding: 0 }}>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          alignItems: 'start'
        }}
      >
        <FormControl fullWidth>
          <InputLabel htmlFor="amount">Amount</InputLabel>
          <OutlinedInput
            id="amount"
            startAdornment={<InputAdornment position="start">$</InputAdornment>}
            label="Amount"
            value={data.target}
            onChange={(e) => onChange('target', e.target.value)}
          />
        </FormControl>

        <FormControl fullWidth>
          <InputLabel htmlFor="city">City</InputLabel>
          <OutlinedInput
            id="city"
            startAdornment
            endAdornment={<InputAdornment position="end"> <PlaceIcon /> </InputAdornment>}
            label="City"
            value={data.city}
            onChange={(e) => onChange('city', e.target.value)}
          />
        </FormControl>

        <FormControl fullWidth>
          <InputLabel htmlFor="country">Country</InputLabel>
          <OutlinedInput
            id="country"
            startAdornment
            endAdornment={<InputAdornment position="end"> <PlaceIcon /> </InputAdornment>}
            label="Country"
            value={data.country}
            onChange={(e) => onChange('country', e.target.value)}
          />
        </FormControl>

        <FormControl fullWidth>
          <InputLabel htmlFor="campaign-limit">Set Campaign Limit</InputLabel>
          <OutlinedInput
            id="campaign-limit"
            startAdornment
            endAdornment={<InputAdornment position="end"> <IndeterminateCheckBoxIcon /> </InputAdornment>}
            label="Set Campaign Limit"
            value={data.campaign_limit}
            onChange={(e) => onChange('campaign_limit', e.target.value)}
          />
        </FormControl>

        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          width: '100%'
        }}>

          <Button
            variant='outlined'
            sx={{
              textTransform: 'none',
              borderRadius: 30,
              height: '44px'
            }}
            startIcon={<AddIcon />}
          >
            <Typography color={theme.palette.primary.main}> Add a Benefeciary </Typography>
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default StepTwo;
