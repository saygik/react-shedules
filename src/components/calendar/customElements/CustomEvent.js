import React from "react"
import { useEffect } from "react";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Person from '@mui/icons-material/Person'
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import InventoryIcon from '@mui/icons-material/Inventory';
import SyncIcon from '@mui/icons-material/Sync';
import CustomTooltip from './CustomTooltip'
import { useMemo, useRef } from "react";
import { eventColor } from '../../../context/data/utils'

import { useData } from '../../../context/data'


const CalendarEvent = styled('div')(({ theme }) => ({
    height: '100%',
    width: '100%',
    cursor: 'pointer',
    position: 'relative',
    background: 'theme.palette.background.paper',
    boxShadow: '2px 2px 2px rgba(0,0,0,0.4)',
    border: '1px',
    borderRadius: '0px',
    borderStyle: 'solid',
    borderLeftWidth: '5px',
}));


const EventIcon = ({ tip, color, status }) => {
    if (!tip) return <></>
    const iconProps = { width: '16px', color: color, fontSize: '0.9rem', paddingTop: '1px', margin: '2px 3px 0px 3px' }
    if (tip.toString() === "1") return <Person sx={iconProps} />
    if (tip.toString() === "2") return <InventoryIcon sx={iconProps} />
    if (tip.toString() === "3" && status.toString()==="3") return <TaskAltIcon sx={iconProps} />
    if (tip.toString() === "3" && status.toString()!=="3") return <SyncIcon sx={iconProps} />
    return <></>
}

const CustomEvent = ({ task }) => {
    //eventInfo.event.extendedProps.notfound
    const { selectors:{ popapedEvent}, popupTask,depopupTask } = useData()
    
    const [anchorEl, setAnchorEl] = React.useState(null);
    const divRef = useRef(null);

    useEffect(()=>{
        setAnchorEl(divRef.current);
        return ()=>setAnchorEl(null)
    },[])

    const handlePopoverOpen = (event) => {
        setAnchorEl(divRef.current);
        popupTask(task.id)
    }
    const handlePopoverClose = () => {
        setAnchorEl(null);
        depopupTask()
    }
    const open = useMemo(() => {
        //return Boolean(anchorEl)
        return popapedEvent===task.id
    }, [task, popapedEvent])

    const eventId = useMemo(() => {
        return 'eventDiv' + task.id
    }, [task.id])

    const evColor = useMemo(() => {
        return eventColor(task.extendedProps.tip, task.extendedProps.status)
    }, [task.extendedProps.tip])

    return (
        <CalendarEvent sx={{ color: evColor }}>
                <Box ref={divRef} ></Box>
            <Box component="div"
                onClick={handlePopoverOpen}
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    marginRight: '20px',

                }}>
                <EventIcon tip={task.extendedProps.tip} status={task.extendedProps.status} color={evColor} />
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
                        color: evColor,
                        paddingTop: '1px',
                        paddingRight: '1px',
                        fontSize: '92%',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }} >
                        {task.title}
                    </Box>
                </Box>
            </Box>
            {open && <CustomTooltip open={open}
                anchorEl={anchorEl}
                parentId={`#${eventId}`}
                handleClose={handlePopoverClose}
                tooltipTask={task}
                color={evColor}
            />}
        </CalendarEvent>
    )
}

export default CustomEvent
