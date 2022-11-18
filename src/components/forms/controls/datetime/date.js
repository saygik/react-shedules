import React from "react";
import { useController } from "react-hook-form";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
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
            <DatePicker
                openTo="day"
                {...field}
                label={label}
                renderInput={(params) =>
                    <StyledTextFieldCalendar
                        sx={{ width: '120px', marginRight: '3px' }}
                        {...params} 
                        error={isError}
                        // helperText={errorMessage}                        
                        />
                }
            />
        </React.Fragment>
    );
}

export default FormDatePicker;
