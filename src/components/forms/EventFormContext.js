
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

import { useState } from 'react';

export default function FormDialogContext({ open, handleClose }) {
    const [title,setTitle] = useState('')
    return (
        <Grid container spacing={1}  >
            <Grid item xs={12}>
                <TextField
                    onChange={(e) => {}}
                    autoFocus
                    id="name"
                    label="Совещание"
                    type="text"
                    value={title}
                    fullWidth
                />
            </Grid>
        </Grid>

    )
}
