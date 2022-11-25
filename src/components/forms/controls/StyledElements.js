import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import { lightBlue, grey } from '@mui/material/colors';
import MenuItem from '@mui/material/MenuItem';

export const StyledButton = styled(Button)(({ theme }) => ({
  fontSize: '0.75rem',
  letterSpacing: '0.08rem'
}));

export const ButtonBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '50%',
  marginTop: '5px',
  justifyContent: "center"
}));

export const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputLabel-root': {
    fontSize: '0.9rem',
    letterSpacing: '0.1em',
    //marginTop:'-4px',

  },
  '& .MuiOutlinedInput-input': {
    padding: '4px'
  },
  '& .MuiOutlinedInput-root': {
    borderRadius: '2px',
    fontSize: '0.9rem',
  },
  '& .MuiOutlinedInput-input': {
    height: '1.2rem',
    padding: '10px',
  },
}));


export const StyledTextFieldCalendar = styled(TextField)(({ theme }) => ({
  '& .MuiIconButton-root': {
    marginRight: '0px',
    color: grey[500],
    padding: '2px',
  },
  '& .MuiSvgIcon-root': {
    width: '18px'
  },
  '& .MuiInputLabel-root': {
    fontSize: '0.9rem',
    letterSpacing: '0.1em',
    //marginTop:'-4px',
  },
  '& .MuiOutlinedInput-root': {
    borderRadius: '2px',
    fontSize: '0.9rem',

    paddingRight: '2px'
  },
  '& .MuiOutlinedInput-input': {
    height: '1.2rem',
    padding: '10px 0 10px 7px',
  },
}));


export const StyledTextFieldMultiline = styled(TextField)(({ theme }) => ({
  '& .MuiInputLabel-root': {
    fontSize: '0.9rem',
    letterSpacing: '0.1em',
  },
  '& .MuiOutlinedInput-root': {
    borderRadius: '2px',
    fontSize: '0.85rem',
  },
}));
export const StyledSelect = styled(Select)(({ theme }) => ({
  width: '100%',
  '& .MuiInputLabel-root': {
    fontSize: '0.9rem',
    letterSpacing: '0.1em',
    //marginTop:'-4px',
  },
  '& .MuiSelect-select': {
    borderRadius: '2px',
    fontSize: '0.9rem',
    padding: '8px',
  },

}));
export const StyledSelectItem = styled(MenuItem)(({ theme }) => ({
  fontSize: '0.9rem'
}));
