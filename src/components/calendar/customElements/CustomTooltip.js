import React from 'react'
import Popover from '@mui/material/Popover'
// import moment from 'moment'
import dayjs from 'dayjs';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined'
import Person from '@mui/icons-material/Person'

import Grid from "@mui/material/Grid"
import ScheduleIcon from '@mui/icons-material/Schedule';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import LinkIcon from '@mui/icons-material/Link';
import Link from '@mui/icons-material/Link';
import { lightBlue, blueGrey } from '@mui/material/colors';
import List from '@mui/material/List';
import { alpha, styled } from '@mui/material/styles';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useMemo } from 'react';
import { useData } from '../../../context/data'

const StyledButton = styled(Button)(({ theme }) => ({
    fontSize: '0.75rem',
    letterSpacing: '0.08rem'
}));
const ButtonBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    width: '50%',
    marginTop: '5px',
    justifyContent: "center"
}));



const CustomTooltip = (props) => {
   const { deleteTask } = useData()
    const { open, event, parentId, handleClose, handleUpdate, anchorEl } = props

    const eventTime = useMemo(() => {
    if (!event) return ""
        const dateStart = event.startStr && dayjs(event.startStr).format(event.allDay ? 'DD.MM.YYYY' : 'DD.MM.YYYY HH:mm')
        const dateEnd = event.endStr && dayjs(event.endStr).format(event.allDay ? 'DD.MM.YYYY' : 'DD.MM.YYYY HH:mm')

        return !dateEnd ? dateStart : dateStart + "-" + dateEnd
    }, [event])
    if (!event) return <></>
    return <>

        <Popover
            id={parentId}
            sx={{
                '& .MuiPopover-paper': {
                    borderRadius: '0px',
                    borderColor: lightBlue[700],
                    borderTopWidth: '3px',
                    borderTopStyle: 'solid',
                    width: "350px"
                },
            }}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
            transformOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
        >
            <Box sx={{
                backgroundColor: 'palette.background.paper',
                margin: '12px',
                marginTop: '0'
            }}>
                <List>
                    <ListItem disablePadding className='draggableEvent'>
                        <ListItemText
                            primary={event.title} primaryTypographyProps={{ sx: { fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }}
                            secondary={event.extendedProps.title} secondaryTypographyProps={{ sx: { color: blueGrey[400], fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }} />
                    </ListItem>
                    <ListItem disablePadding className='draggableEvent'>
                        <ListItemIcon sx={{ minWidth: 30 }}><AccessTimeIcon sx={{ width: 20 }} /> </ListItemIcon>
                        <ListItemText
                            secondary={eventTime}
                            secondaryTypographyProps={{ sx: { color: blueGrey[400], fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }} />
                    </ListItem>
                </List>
                <Box sx={{ borderColor: blueGrey[100], borderTopWidth: '1px', borderTopStyle: 'solid', display: 'flex', }}>
                    <ButtonBox sx={{ borderColor: blueGrey[100], borderRightWidth: '1px', borderRightStyle: 'solid', }}>
                        <StyledButton onClick={() => deleteTask(event.id)}                          
                         variant="text">Удалить</StyledButton>
                    </ButtonBox>
                    <ButtonBox>
                        <StyledButton variant="text">Редактировать</StyledButton>
                    </ButtonBox>
                </Box>
            </Box>

        </Popover>
    </>
}

export default CustomTooltip
