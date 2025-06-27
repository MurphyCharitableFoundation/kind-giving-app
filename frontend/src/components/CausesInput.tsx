import React, { useState } from "react";
import { Box, Chip, TextField, Typography, Button } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import theme from "../theme/theme";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import { FreeMode } from "swiper/modules";

interface CausesInputProps {
  isEditing: boolean;
  causes: string[];
  onCausesChange: (newCauses: string[]) => void;
}

const CausesInput: React.FC<CausesInputProps> = ({
  isEditing,
  causes,
  onCausesChange,
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault();
      const trimmed = inputValue.trim();
      if (!causes.includes(trimmed)) {
        onCausesChange([...causes, trimmed]);
      }
      setInputValue("");
    }
  };

  const handleDelete = (chipToDelete: string) => {
    const updated = causes.filter((cause) => cause !== chipToDelete);
    onCausesChange(updated);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {!isEditing && (
        <Typography
          color={theme.palette.primary.main}
          variant="titleXSmalltextMedium"
        >
          Causes
        </Typography>
      )}
      {isEditing ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 1,
            p: 1,
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        >
          {causes.map((cause, index) => (
            <Chip
              key={index}
              label={cause}
              onDelete={() => handleDelete(cause)}
              sx={{
                backgroundColor: theme.palette.secondary.container,
                color: theme.palette.primary.main,
                "& .MuiChip-deleteIcon": {
                  color: theme.custom.surface.onColor,
                },
              }}
              deleteIcon={<CloseRoundedIcon />}
            />
          ))}
          <TextField
            variant="standard"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            InputProps={{ disableUnderline: true }}
            sx={{ minWidth: 120 }}
          />
        </Box>
      ) : (
        <Box sx={{ overflowX: "auto" }}>
          <Swiper
            spaceBetween={10}
            slidesPerView="auto"
            freeMode
            modules={[FreeMode]}
            style={{ padding: "4px 0" }}
          >
            {causes.map((cause, index) => (
              <SwiperSlide
                key={index}
                style={{ width: "auto" }} // allow slide to fit button width
              >
                <Button
                  variant="contained"
                  disableElevation
                  sx={{
                    borderRadius: "40px",
                    bgcolor: theme.palette.secondary.container,
                    textTransform: "none",
                    whiteSpace: "nowrap",
                    paddingX: "16px",
                  }}
                >
                  <Typography color={theme.palette.primary.main}>
                    {cause}
                  </Typography>
                </Button>
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>
      )}
    </Box>
  );
};

export default CausesInput;
