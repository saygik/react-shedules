import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';
//* MUI 
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { lightBlue, blueGrey } from '@mui/material/colors';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';


import InputTXT from './controls/input';
import { StyledSelectItem, StyledSelect, StyledButton, ButtonBox, StyledTextField, StyledTextFieldMultiline, StyledTextFieldCalendar } from './controls/StyledElements';

const validationSchema = yup.object().shape({
    name: yup.string().required("поле 'Наименование' обязательно к заполнению"),
});


export default function FormDialogContext({ open, handleClose }) {

    const { register, handleSubmit, watch, formState: { errors } } = useForm({
            resolver: yupResolver(validationSchema),
        });
    const onSubmit = data => console.log(data);

    // const onSubmit = (data) => {

    //     console.log('---------------');
    //     console.log(data);
    // };

    console.log(watch("name")); // watch input value by passing the name of it
    console.log('errors',errors)    
     
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogContent
                sx={{
                    padding: 1,
                    borderRadius: '0px',
                    borderColor: lightBlue[700],
                    borderTopWidth: '5px',
                    borderTopStyle: 'solid',
                    width: "450px"
                }}
            >

                    <Stack direction="row">
                        <AccountCircleIcon sx={{ width: 20, color: lightBlue[900], margin: '7px 7px 0 0' }} />
                        <StyledTextField
                        {...register("name")}
                            autoFocus
                            id="name"
                            label="ФИО"
                            type="text"
                            fullWidth
                            error={errors.hasOwnProperty('name')}
                            helperText={errors.name?.message}
                        />
                    </Stack>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit(onSubmit)}
                    >
                        SUBMIT
                    </Button>                    
            </DialogContent>
        </Dialog>
    )
}