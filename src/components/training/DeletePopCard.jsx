import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
} from '@mui/material';

const DeletePopCard = ({ title, cancelDelete, confirmDelete }) => {
    return (
        <Dialog open={true} onClose={cancelDelete}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <Typography variant="body1">
                    Are you sure you want to delete this item?
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={cancelDelete} color="primary">
                    Cancel
                </Button>
                <Button onClick={confirmDelete} color="secondary">
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeletePopCard;
