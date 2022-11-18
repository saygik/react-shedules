import React from 'react'
import Popover from '@mui/material/Popover'

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { lightBlue, blueGrey } from '@mui/material/colors';
import List from '@mui/material/List';
import { styled } from '@mui/material/styles';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useMemo } from 'react';
import { useData } from '../../../context/data'
import { DateToHumanString } from '../../../context/data/utils'

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
    const { deleteTask, selectTask } = useData()
    const { open, event, parentId, handleClose, anchorEl } = props
    //    const {  selectors: {sortedUsers, scheduleName, loading, loaded, editTaskOpen}, getSchedule, deselectTask } = useData()

    const eventTime = useMemo(() => {
        if (!event) return ""
        const dateStart = DateToHumanString(event.startStr, event.allDay)
        const dateEnd = DateToHumanString(event.endStr, event.allDay, true)

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
                    <ListItem disablePadding >
                        <ListItemText
                            primary={event.title} primaryTypographyProps={{ sx: { fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }}
                            secondary={event.extendedProps.title} secondaryTypographyProps={{ sx: { color: blueGrey[400], fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }} />
                    </ListItem>
                    <ListItem disablePadding >
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
                        <StyledButton onClick={() => selectTask({ id: event.id })}
                            variant="text">Редактировать</StyledButton>
                    </ButtonBox>
                </Box>
            </Box>

        </Popover>
    </>
}

export default CustomTooltip
