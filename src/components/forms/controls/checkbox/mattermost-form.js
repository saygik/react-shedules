import React from "react";
import { Controller } from "react-hook-form";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Matt from '../../../icons/mattermost'
import { lightBlue, blueGrey } from '@mui/material/colors';

function FormCheckBox(props) {

    const { name, label, control } = props;
    return (
        <React.Fragment>
            <Controller
                name={name}
                control={control}
                defaultValue={true}
                label={label}
                rules={{ required: true }}
                render={({
                    field: { onChange, onBlur, value, ref },
                }) => (
                    <FormControlLabel sx={{
                        color: value ? lightBlue[900]: blueGrey[200],
                        '& .MuiTypography-root': { fontSize: '.9rem' },
                        '& .MuiCheckbox-root': { paddingRight: '5px' },
                    }}
                        label={label}
                        control={<Checkbox size="small"
                            onBlur={onBlur} // notify when input is touched
                            onChange={onChange} // send value to hook form
                            icon={<Matt sx={{color: blueGrey[200], fontSize:'1.5rem', marginRight:'2px'}}/>}
                            checkedIcon={<Matt sx={{color: lightBlue[900], fontSize:'1.5rem', marginRight:'2px'}}/>}
                            checked={value}
                            inputRef={ref}
                        />} />
                )}
                {...props}
            />
        </React.Fragment>
    );
}

export default FormCheckBox;
