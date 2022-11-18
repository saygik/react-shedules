
import React from "react";
import { useController } from "react-hook-form";
import { StyledTextField } from '../StyledElements';


function FormInput({ name, label, control, disabled, autoFocus  }) {
    const {
      field: { ref, ...field },
      formState: { errors }
    } = useController({
      name,
      control,
      rules: { required: true },
      defaultValue: "",
    });

    let isError = false;
    let errorMessage = "";
    if (errors && errors.hasOwnProperty(name)) {
      isError = true;
      errorMessage = errors[name].message;
    }
      return (
        <StyledTextField
        sx={{ marginBottom: '15px' }}
        disabled={disabled}
        autoFocus={autoFocus}
        label={label}
        type="text"
        fullWidth
        {...field}
        error={isError}
        helperText={errorMessage}
      />
    
    );
  }
  
  export default FormInput;
  