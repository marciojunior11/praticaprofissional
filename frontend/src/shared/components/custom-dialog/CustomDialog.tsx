import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Icon, Typography } from "@mui/material";
import React, { useCallback, useState } from "react"

interface IDialogProps {
    title: string;
    children?: React.ReactNode;
}

export const useDialog = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false); 

    const toggleDialogOpen = () => {
        console.log(isDialogOpen);
        setIsDialogOpen(oldValue => !oldValue);
    }

    return {toggleDialogOpen, isDialogOpen}
}

export const CustomDialog: React.FC<IDialogProps> = ({ title, children }) => {

    const { toggleDialogOpen, isDialogOpen } = useDialog();

    return (
        <Dialog onClose={toggleDialogOpen} open={isDialogOpen}>
            <DialogTitle sx={{ m: 0, p: 2 }}>
                <Typography>
                    {title}
                </Typography>
            </DialogTitle>
            <DialogContent dividers>
                {children}
            </DialogContent>
            <DialogActions>
                <Button startIcon={<Icon>save</Icon>} variant="contained" color="primary" onClick={toggleDialogOpen}>
                    Salvar
                </Button>
                <Button startIcon={<Icon>calcel</Icon>} variant="contained" color="error" onClick={toggleDialogOpen}>
                    Cancelar
                </Button>
            </DialogActions>
        </Dialog>
    )
}