import { Box, Button, Typography } from "@mui/material";
import styles from "./Modal.module.css";
import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import theme from "../../theme/theme";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  headerText: string;
  bodyText: string;
  handleDelete: () => void;
}

const Modal = ({
  isOpen,
  onClose,
  handleDelete,
  headerText,
  bodyText,
}: ModalProps) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const closeModal = useCallback(() => {
    if (dialogRef.current) {
      dialogRef.current.close();
    }

    onClose();
  }, [onClose]);

  useEffect(() => {
    const dialog = dialogRef.current;

    // Open the modal when isOpen is true
    if (isOpen && dialog) {
      dialog.showModal();
    } else if (dialog) {
      dialog.close();
    }

    // Handle Clicking outside the modal for closing it
    const handleBackdropClick = (event: MouseEvent) => {
      if (event.target === event.currentTarget) {
        closeModal();
      }
    };

    // Handle Escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };

    dialog?.addEventListener("mousedown", handleBackdropClick);
    window.addEventListener("keydown", handleEscape);

    return () => {
      dialog?.removeEventListener("mousedown", handleBackdropClick);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose, closeModal]);

  return createPortal(
    <dialog className={styles.dialog} ref={dialogRef}>
      <Box className={styles.modal}>
        {/* Modal Header */}
        <Typography
          sx={{
            bgcolor: theme.status.error.main,
            fontSize: "24px",
            color: "white",
            padding: "12px 16px",
          }}
        >
          {headerText}
        </Typography>

        {/* Modal Body */}
        <Box
          sx={{
            padding: "12px 16px",
          }}
        >
          <div>
            <Typography>{bodyText}</Typography>
          </div>

          {/* Cancel and Delete buttons div */}
          <Box
            sx={{
              paddingTop: "15px",
              marginTop: "15px",
              width: "100%",
              display: "flex",
              gap: "10px",
              justifyContent: "space-around",
            }}
          >
            <Button
              variant="contained"
              disableElevation
              onClick={closeModal}
              sx={{
                borderRadius: "40px",
                border: "1px solid rgba(0, 0, 0, 0.6)",
                textTransform: "none",
                paddingY: "10px",
                paddingX: "24px",
                alignItems: "center",
                backgroundColor: theme.custom.surface.main,
                width: "131px",
                height: "47px",
              }}
            >
              <Typography
                sx={{
                  color: theme.palette.primary.main,
                }}
              >
                Cancel
              </Typography>
            </Button>

            <Button
              variant="contained"
              disableElevation
              onClick={handleDelete}
              sx={{
                borderRadius: "40px",
                textTransform: "none",
                paddingY: "10px",
                paddingX: "24px",
                alignItems: "center",
                width: "131px",
                height: "47px",
                bgcolor: theme.status.error.main,
              }}
            >
              <Typography
                sx={{
                  color: "white",
                }}
              >
                Delete
              </Typography>
            </Button>
          </Box>
        </Box>
      </Box>
    </dialog>,
    document.body
  );
};

export default Modal;
