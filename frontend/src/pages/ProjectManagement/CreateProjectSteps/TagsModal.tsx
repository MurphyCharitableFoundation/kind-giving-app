import { Box, Button, Chip, Modal, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import theme from "../../../theme/theme";
import { getCauses } from "../../../utils/endpoints/causesEndpoints";
import Cause from "../../../interfaces/Cause";

export interface CauseDraft {
    id?: number;      // undefined for new causes
    name: string;
}

interface TagsModalProps {
    open: boolean;
    onClose: () => void;
    causes: Cause[];
    value: CauseDraft[];                     // selected cause IDs
    onSave: (value: CauseDraft[]) => void; // emit updates
}

export const TagsModal: React.FC<TagsModalProps> = ({
    open,
    onClose,
    value,
    onSave,
    causes
}) => {
    const [draft, setDraft] = useState<CauseDraft[]>([]);
    const [search, setSearch] = useState("");
    const [availableCauses, setAvailableCauses] = useState<CauseDraft[]>([]);
    const [selectedCauses, setSelectedCauses] = useState<CauseDraft[]>([]);

    const causeExists = causes.some(
        c => c.name.toLowerCase() === search.toLowerCase()
    );
    const alreadySelected = draft.some(
        c => c.name.toLowerCase() === search.toLowerCase()
    );

    const addNewCause = () => {
        if (!search.trim()) return;

        const newCause = { name: search.trim() };

        setAvailableCauses(prev => [...prev, newCause]);
        setSelectedCauses(prev => [...prev, newCause]);

        setSearch("");
    };

    useEffect(() => {
        if (open) {
            setSelectedCauses(value);

            setAvailableCauses(prev => {
                const existing = causes.map(c => ({ id: c.id, name: c.name }));

                const merged = [...existing, ...value.filter(v => !v.id)];

                return merged.filter(
                    (c, i, arr) =>
                        arr.findIndex(x =>
                            x.id
                                ? x.id === c.id
                                : x.name.toLowerCase() === c.name.toLowerCase()
                        ) === i
                );
            });

            setSearch("");
        }
    }, [open, value, causes]);

    const toggleCause = (cause: CauseDraft) => {
        setSelectedCauses(prev => {
            const exists = prev.some(c =>
                c.id ? c.id === cause.id : c.name === cause.name
            );

            if (exists) {
                return prev.filter(c =>
                    c.id ? c.id !== cause.id : c.name !== cause.name
                );
            }

            return [...prev, cause];
        });
    };

    const handleSave = () => {
        onSave(selectedCauses);
        onClose();
    };

    const handleCancel = () => {
        onClose();
    };

    const renderChip = (
        label: string,
        selected: boolean,
        onClick: () => void
    ) => (
        <Chip
            label={label}
            clickable
            onClick={onClick}
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

                <TextField
                    fullWidth
                    placeholder="Search or create a cause"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !causeExists && !alreadySelected) {
                            e.preventDefault();
                            addNewCause();
                        }
                    }}
                />

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
                        {availableCauses
                            .filter(c =>
                                c.name.toLowerCase().includes(search.toLowerCase())
                            )
                            .map((cause, index) => {
                                const selected = selectedCauses.some(c =>
                                    c.id ? c.id === cause.id : c.name === cause.name
                                );

                                return renderChip(
                                    cause.id ? cause.name : `${cause.name} (new)`,
                                    selected,
                                    () => toggleCause(cause)
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
