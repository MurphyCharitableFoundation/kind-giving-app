import { Box, Button, Chip, Modal, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import theme from "../../../theme/theme";
import { getCauses } from "../../../utils/endpoints/causesEndpoints";
import Cause from "../../../interfaces/Cause";

interface TagsModalProps {
    open: boolean;
    onClose: () => void;
    causes: Cause[];
    value: number[];                     // selected cause IDs
    onSave: (value: number[]) => void; // emit updates
}

export const TagsModal: React.FC<TagsModalProps> = ({
    open,
    onClose,
    value,
    onSave,
    causes
}) => {

    const [draft, setDraft] = useState<number[]>([]);

    useEffect(() => {
        if (open) {
            setDraft(value);
        }
    }, [open, value]);

    const toggleCause = (causeId: number) => {
        setDraft((prev) =>
            prev.includes(causeId)
                ? prev.filter((id) => id !== causeId)
                : [...prev, causeId]
        );
    };

    const handleSave = () => {
        onSave(draft);
        onClose();
    };

    const handleCancel = () => {
        onClose();
    };


    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 400,
                    bgcolor: "background.paper",
                    borderRadius: 2,
                    p: 3,
                    display: "flex",
                    flexDirection: "column",
                    gap: '24px',
                }}
            >
                <Typography variant='titleXLargetextMedium' color={theme.custom.surface.onColor}>Select Tags</Typography>
                <Typography variant='bodyMedium' color={theme.custom.surface.onColor}>I want to support someone for:</Typography>

                {/* Scrollable content */}
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '16px',
                        maxHeight: "200px",  // Limit the height
                        overflowY: "auto",   // Enable vertical scrolling
                        /* Firefox */
                        scrollbarWidth: "none",

                        /* IE 10+ */
                        msOverflowStyle: "none",

                        /* Chrome, Safari, Edge */
                        "&::-webkit-scrollbar": {
                            display: "none",
                        },
                    }}
                >
                    {/* The long list of tags */}
                    <Box
                        sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "12px",
                            maxHeight: "200px",
                            overflowY: "auto",

                            scrollbarWidth: "none",
                            msOverflowStyle: "none",
                            "&::-webkit-scrollbar": {
                                display: "none",
                            },
                        }}
                    >
                        {causes.map((item) => {
                            const selected = draft.includes(item.id);
                            return (
                                <Chip
                                    key={item.id}
                                    label={item.name}
                                    clickable
                                    onClick={() => toggleCause(item.id)}
                                    sx={{
                                        borderRadius: "10px",
                                        transition: "all 200ms ease",

                                        backgroundColor: selected
                                            ? theme.palette.primary.main
                                            : theme.custom.surface.variant,

                                        color: selected
                                            ? theme.palette.primary.onColor
                                            : theme.custom.surface.onColorVariant,

                                        "&:hover": {
                                            backgroundColor: selected
                                                ? theme.palette.primary.dark
                                                : theme.custom.surface.variant,
                                        },
                                    }}
                                />
                            );
                        })}
                    </Box>
                </Box>
                <Box
                    sx={{
                        position: "relative",
                        mt: 2,
                        pt: "32px",
                        px: "24px",
                        pb: "24px",
                    }}
                >
                    <Button
                        fullWidth
                        variant="contained"
                        disableElevation
                        sx={{
                            borderRadius: '30px',
                            textTransform: 'none',
                            mb: '16px'
                        }}
                        onClick={handleSave}
                    >
                        Save
                    </Button>
                    <Button
                        fullWidth
                        variant="outlined"
                        disableElevation
                        sx={{
                            borderRadius: '30px',
                            textTransform: 'none'
                        }}
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};
