import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

const CalendarEvent = styled('div') (({ theme}) => ({
    cursor: 'pointer',
    position: 'relative',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    background: 'theme.palette.background.paper',
    opacity: '0.85',
    boxShadow: '3px 3px 2px rgba(0,0,0,0.4)',    
    borderRadius: '3px',
    '&:hover': {
        opacity: '1',
        transition: '0.3s ease-in',
    }
}));

export default function UserCalendarCard(props) {
    const {name, title, notfounded}=props
    return (
        <CalendarEvent>
            <Box sx={{
                  position: 'absolute',
                  top: '14px',
                  left: '12px',
                  fontSize: '80%',
                  color: 'grey.500',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
            }} >
                {title}
            </Box>     
            <Box sx={{
                  padding: '2px 4px 10px',
                  color: notfounded ? 'error.main':'text.secondary',
                  fontSize: '92%',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
            }} >
                {name}
            </Box>
        </CalendarEvent>
    )
}