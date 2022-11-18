import React from "react";
import { Controller } from "react-hook-form";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';



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
                        '& .MuiTypography-root': { fontSize: '.9rem' },
                        '& .MuiCheckbox-root': { paddingRight: '5px' },
                    }}
                        label="Весь день"
                        control={<Checkbox size="small"
                            onBlur={onBlur} // notify when input is touched
                            onChange={onChange} // send value to hook form
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
