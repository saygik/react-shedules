import React from "react";
import { useController } from "react-hook-form";
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

import { StyledSelectItem, StyledSelect } from '../StyledElements';


const MuiSelect = (props) => {
    const { value, label, name, disabled, errorobj, onChange, onBlur } = props;
    let isError = false;
    let errorMessage = "";
    if (errorobj && errorobj.hasOwnProperty(name)) {
        isError = true;
        errorMessage = errorobj[name].message;
    }

    return (

        <FormControl fullWidth={true} error={isError} size="small" sx={{width:'180px'}}>
            <InputLabel id="demo-select-small" disabled={disabled}>{label}</InputLabel>
            <StyledSelect
                disabled={disabled}
                id={`${name}-select`}
                label={label}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
            >
                <StyledSelectItem value={1}>Новая</StyledSelectItem>
                <StyledSelectItem value={2}>В работе</StyledSelectItem>
                <StyledSelectItem value={3}>Выполнена</StyledSelectItem>
            </StyledSelect>
            <FormHelperText>{errorMessage}</FormHelperText>
        </FormControl>

    );
};

function FormSelect(props) {
    const { name, label, control, disabled, disabledFirstItem } = props;
    const {
        field:{ref, ...field},
        formState: { errors }
    } = useController({
        name ,
        control,
        rules: { required: true },
        defaultValue: "",
    });

    return (
        <React.Fragment>
            <MuiSelect
                {...field}
                label={label}
                errorobj={errors}
                disabledFirstItem={disabledFirstItem}
                disabled={disabled}
            />
        </React.Fragment>
    );
}

export default FormSelect;
