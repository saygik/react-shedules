import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormDialogContext from './EventFormContext'

export default function FormDialog({open, handleClose}) {

  return (
    <div>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
            <FormDialogContext/>
                  </DialogContent>
        <DialogActions>
                    <Button onClick={handleClose}  color="secondary">
                        Удалить
                    </Button>
                    <Button onClick={handleClose}   color="primary">
                        Подтвердить
                    </Button>
                    <Button onClick={handleClose} color="primary">
                        Отклонить
                    </Button>
                </DialogActions>        
      </Dialog>
    </div>
  );
}
