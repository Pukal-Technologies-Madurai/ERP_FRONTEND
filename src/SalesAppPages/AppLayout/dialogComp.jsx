import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, Button, DialogActions } from '@mui/material';

const DialogComp = (props) => {
    const [open, setOpen] = useState(false);
    const { fullWidth, maxWidth, Title, displayContent, closeFunction, submitFunction, submitTitle } = props;

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <span>

            <span onClick={handleOpen} style={{ cursor: 'pointer' }}>{props.children}</span>

            <Dialog
                open={open}
                onClose={() => { handleClose(); closeFunction(); }}
                fullWidth={fullWidth ? fullWidth : false}
                maxWidth={maxWidth ? maxWidth : 'md'}
            >

                <DialogTitle>{Title}</DialogTitle>

                <DialogContent>
                    {displayContent}
                </DialogContent>

                <DialogActions>

                    <Button
                        color="primary"
                        onClick={() => {
                            handleClose();
                        }}>
                        Close
                    </Button>

                    <Button variant='outlined' color="primary" onClick={() => { handleClose(); submitFunction(); }}>
                        {submitTitle ? submitTitle : 'submit'}
                    </Button>

                </DialogActions>

            </Dialog>
        </span>
    );
};

export default DialogComp;
