import { Button, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle, Icon, IconButton, Slide, Typography } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import React, { useCallback, useState } from "react"

interface IDialogProps extends DialogProps{
    title: string;
    handleClose: () => void,
    open: boolean,
    children?: React.ReactNode;
}

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
      children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
  ) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

export const CustomDialog: React.FC<IDialogProps> = ({ title, handleClose, open, children, ...rest }) => {

    return (
        <Dialog onClose={handleClose} open={open} {...rest} TransitionComponent={Transition}>
            <DialogTitle sx={{ m: 0, p: 2 }}>
                { rest.onClose && (
                    <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                    >
                        <Icon>
                            close
                        </Icon>
                    </IconButton>
                ) }
                <Typography>
                    {title}
                </Typography>
            </DialogTitle>
            <DialogContent dividers>
                {children}
            </DialogContent>
        </Dialog>
    )
}