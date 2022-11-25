import React from "react";
import Checkbox from '@mui/material/Checkbox';
import Matt from '../../../icons/mattermost'
import { lightBlue, blueGrey } from '@mui/material/colors';

function FormCheckBox(props) {
    const { value, onChange } = props;
    return <Checkbox size="small"
        onChange={onChange} // send value to hook form
        icon={<Matt sx={{ color: blueGrey[200], fontSize: '1.5rem', marginRight: '2px' }} />}
        checkedIcon={<Matt sx={{ color: lightBlue[900], fontSize: '1.5rem', marginRight: '2px' }} />}
        checked={value}
    />
}

export default FormCheckBox;
