
import React from "react";
import { useController } from "react-hook-form";

import { StyledTextFieldMultiline } from '../StyledElements';


function FormInputMultiline({ name, label, control, disabled }) {
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
        <StyledTextFieldMultiline
        disabled={disabled}
        label={label}
        type="text"
        multiline
        rows={3}
        fullWidth
        {...field}
        error={isError}
        helperText={errorMessage}
      />
    
    );
  }
  
  export default FormInputMultiline;
  