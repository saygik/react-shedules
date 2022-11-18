import React from "react";
import { useController } from "react-hook-form";
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { StyledTextFieldCalendar } from '../StyledElements';

function FormDatePicker(props) {
    const { name, label, control } = props;
    const {
        field: { ref, ...field },
        formState: { errors }
    } = useController({
        name,
        control,
    });

    const isError = (errors && errors.hasOwnProperty(name));
    return (
        <React.Fragment>
            <TimePicker
                {...field}
                label={label}
                renderInput={(params) =>
                    <StyledTextFieldCalendar
                        sx={{ width: '120px', marginRight: '3px' }}
                        {...params}
                        error={isError}
                    />
                } />
        </React.Fragment>
    );
}

export default FormDatePicker;
