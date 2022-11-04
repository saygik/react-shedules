import React, { useState } from "react"
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined'
import Person from '@mui/icons-material/Person'
import { lightBlue } from '@mui/material/colors';
import CustomTooltip from './CustomTooltip'
import { useMemo } from "react";


const CalendarEvent = styled('div')(({ theme }) => ({
    height: '100%',
    width: '100%',
    cursor: 'pointer',
    position: 'relative',
    background: 'theme.palette.background.paper',
    //    opacity: '0.85',
    boxShadow: '2px 2px 2px rgba(0,0,0,0.4)',
    //borderRadius: '2px',
    border: '1px',
    borderRadius: '0px',
    borderStyle: 'solid',
    borderLeftWidth: '5px',
    //    transition: 'background-color 0.2s, opacity 0.2s, font-weight 0.2s, font-size 0.2s, border 0.2s',
    //     '&:hover': {
    //         opacity: '1',
    //         transition: '0.3s ease-in',
    //     }
}));


const CustomEvent = ({ event }) => {
    //eventInfo.event.extendedProps.notfound
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handlePopoverOpen  = (event) => {
        setAnchorEl(event.currentTarget);
    }
    const handlePopoverClose  = () => {
        setAnchorEl(null);
    }

    const open= useMemo(()=>{
        return Boolean(anchorEl)
    },[anchorEl])

    const eventId= useMemo(()=>{
        return 'eventDiv' + event.id
    },[event.id])
    
    return (
        <CalendarEvent sx={{ color: lightBlue[700] }}>
            <Box component="div"
                onClick={handlePopoverOpen}
                aria-owns={open ? eventId : undefined}
                aria-haspopup="true"                
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    marginRight: '20px',

                }}>
                <Box style={{ margin: '3px' }}>
                    <Person sx={{ width: '18px' }} />
                </Box>
                <Box
                    component="div"
                    style={{
                        width: '100%',
                        height: '100%',
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center"
                    }}>

                    <Box sx={{
                        color: lightBlue[900],
                        paddingRight: '1px',
                        fontSize: '92%',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }} >
                        {event.title}
                    </Box>
                    <Box sx={{
                        color: event.extendedProps.notfound ? 'error.main' : 'text.secondary',
                        fontSize: '85%',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }} >
                        {event.extendedProps.title}
                    </Box>
                </Box>
            </Box>
            <CustomTooltip open={open}
                          anchorEl={anchorEl}
                          parentId={`#${eventId}`}
                          handleClose={handlePopoverClose}
                          event={event}
           />
        </CalendarEvent>
    )
}

export default CustomEvent
