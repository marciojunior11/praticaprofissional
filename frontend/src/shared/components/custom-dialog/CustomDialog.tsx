import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Icon, Typography } from "@mui/material";
import React, { useCallback, useState } from "react"

interface IDialogProps {
    title: string;
    handleClose: () => void,
    open: boolean,
    children?: React.ReactNode;
}

export const CustomDialog: React.FC<IDialogProps> = ({ title, handleClose, open, children }) => {

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle sx={{ m: 0, p: 2 }}>
                <Typography>
                    {title}
                </Typography>
            </DialogTitle>
            <DialogContent dividers>
                {children}
            </DialogContent>
            <DialogActions>
                <Button startIcon={<Icon>save</Icon>} variant="contained" color="primary" onClick={handleClose}>
                    Salvar
                </Button>
                <Button startIcon={<Icon>calcel</Icon>} variant="contained" color="error" onClick={handleClose}>
                    Cancelar
                </Button>
            </DialogActions>
        </Dialog>
    )
}