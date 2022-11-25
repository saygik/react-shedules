import React from 'react'
import Popover from '@mui/material/Popover'

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { lightBlue, blueGrey } from '@mui/material/colors';
import IconButton from '@mui/material/IconButton';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import PhonelinkRingIcon from '@mui/icons-material/PhonelinkRing';
import MailIcon from '@mui/icons-material/Mail';
import BadgeIcon from '@mui/icons-material/Badge';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CommentIcon from '@mui/icons-material/Comment';
import { styled } from '@mui/material/styles';
import { useMemo } from 'react';
import { useData } from '../../../context/data'
import { DateToHumanString } from '../../../context/data/utils'
import { useEffect } from 'react';
import CheckBoxMattermost from '../../forms/controls/checkbox/mattermost';
import Linkify from 'react-linkify';

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

const liittleIconStyle= { width: 18, color: blueGrey[500], margin: '0px 3px 0 30px' }


const UserProperty = ({value, icon}) => {
    if (!value) return <></>
    return (
            <Stack direction="row" justifyContent="flex-start" alignItems="flex-start">
            {icon}
            <Box sx={{ fontSize: '0.8rem', paddingTop: '3px', color: blueGrey[600] }} >
                {value}
            </Box>
        </Stack>
    )
}

const getTipName = (tip) => {
    const tips = []
    tips[1] = "График"
    tips[2] = "Событие"
    tips[3] = "Задача"
    return tips[tip]
}

const CustomTooltip = (props) => {
    const { deleteTask, selectTask, updateTaskFromCalendarEvent } = useData()
    const { open, tooltipTask, parentId, handleClose, anchorEl, color } = props

    useEffect(() => {
        if (!open) return
    }, [open])


    const newTask = useMemo(() => {
        return {
            id: tooltipTask.id,
            tip: tooltipTask.extendedProps.tip,
            status: tooltipTask.extendedProps.status,
            title: tooltipTask.title,
            start: tooltipTask.start,
            end: tooltipTask.start,
            range: {
                start: tooltipTask._instance.range.start,
                end: tooltipTask._instance.range.end,
            },
            allDay: tooltipTask.allDay,
            sendMattermost: tooltipTask.extendedProps.sendMattermost,
            comment: tooltipTask.extendedProps.comment
        }
    }, [tooltipTask])
    const task = useMemo(() => {
        if (!tooltipTask) return {}
        const dateStart = DateToHumanString(tooltipTask.startStr, tooltipTask.allDay)
        const dateEnd = DateToHumanString(tooltipTask.endStr, tooltipTask.allDay, true)

        return {
            id: tooltipTask.id,
            name: tooltipTask.title,
            upn: tooltipTask.extendedProps?.title,
            time: !dateEnd ? dateStart : dateStart + "-" + dateEnd,
            tip: getTipName(tooltipTask.extendedProps?.tip),
            tipId: tooltipTask.extendedProps?.tip,
            sendToMattermost: tooltipTask.extendedProps?.sendMattermost === "true",
            comment: tooltipTask.extendedProps?.comment || "",
            status: tooltipTask.extendedProps?.status || 1,
            mobile: tooltipTask.extendedProps?.mobile,
            mail: tooltipTask.extendedProps?.mail,
            telephoneNumber: tooltipTask.extendedProps?.telephoneNumber,
            title: tooltipTask.extendedProps?.title
        }
    }, [tooltipTask])

    const isTask = useMemo(() => {
        return task.tipId === "3"
    }, [task])

    const isTaskComplate = useMemo(() => {
        return task.status === "3"
    }, [task])

    const handleComplateTask = () => updateTaskFromCalendarEvent({ ...newTask, status: "3" })
    const handleChangeMattermost = (event) => updateTaskFromCalendarEvent({ ...newTask, sendMattermost: event.target.checked })

    if (!tooltipTask || !open || !anchorEl) return <></>
    return <>
        <Popover
            id={parentId}
            sx={{
                '& .MuiPopover-paper': {
                    borderRadius: '0px',
                    borderColor: color,
                    borderTopWidth: '3px',
                    borderTopStyle: 'solid',
                    width: "450px"
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
                margin: 1,
                marginTop: '0'
            }}>
                <Stack sx={{ margin: '5px 5px' }} >
                    <Stack direction="row" justifyContent="flex-end" >
                        <Box sx={{ fontSize: '0.9rem', color: color, fontWeight: '600', letterSpacing: '0.05rem' }}>
                            {task.tip}
                        </Box>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" pb={1}
                        sx={{ borderColor: blueGrey[100], borderBottomWidth: '1px', borderBottomStyle: 'solid', }}
                    >
                        <Stack direction="row" >
                            <AccessTimeIcon sx={{ width: 20, color: lightBlue[900], margin: '7px 7px 0 0' }} />
                            <Box sx={{ fontSize: '0.8rem', paddingTop: '10px', letterSpacing: '-0.4px' }} >
                                {task.time}
                            </Box>
                        </Stack>
                        <Box >
                            <CheckBoxMattermost value={task.sendToMattermost} label={""} onChange={handleChangeMattermost} />
                            {isTask && <IconButton disabled={isTaskComplate} aria-label="complate" onClick={handleComplateTask}>
                                <CheckCircleOutlineIcon sx={{ width: 20, color: isTaskComplate ? "green" : blueGrey[200] }} />
                            </IconButton>}
                        </Box>
                    </Stack>
                    <Stack direction="row" justifyContent="flex-start" alignItems="flex-start">
                        <AccountCircleIcon sx={{ width: 20, color: lightBlue[900], margin: '7px 7px 0 0' }} />
                        <Box sx={{ fontSize: '0.9rem', paddingTop: '8px' }} >
                            {task.name}
                        </Box>
                    </Stack>
                    <UserProperty value={task.title} icon={<BadgeIcon sx={liittleIconStyle} />} />
                    <UserProperty value={task.mail} icon={<MailIcon sx={liittleIconStyle} />} />
                    <UserProperty value={task.telephoneNumber} icon={<LocalPhoneIcon sx={liittleIconStyle} />} />
                    <UserProperty value={task.mobile} icon={<PhonelinkRingIcon sx={liittleIconStyle} />} />
                    {!!task.comment && <Stack direction="row" justifyContent="flex-start" alignItems="flex-start">
                        <CommentIcon sx={{ width: 20, color: lightBlue[900], margin: '7px 7px 0 0' }} />
                        <Box sx={{
                            fontSize: '0.9rem',
                            paddingTop: '8px',
                            color: blueGrey[500],
                            overflowWrap: 'anywhere',
                            '& a': {
                                textDecoration: 'none',
                                color: blueGrey[600]
                            },
                            '& a:hover': {
                                color: lightBlue[800]
                            }
                        }} >
                            <Linkify
                                componentDecorator={(decoratedHref, decoratedText, key) => (
                                    <a target="blank" href={decoratedHref} key={key}>
                                        ссылка
                                    </a>
                                )}
                            >
                                {task.comment}
                            </Linkify>
                        </Box>
                    </Stack>
                    }
                </Stack>

                <Stack direction="row" sx={{ borderColor: blueGrey[100], borderTopWidth: '1px', borderTopStyle: 'solid', }}>
                    <ButtonBox sx={{ borderColor: blueGrey[100], borderRightWidth: '1px', borderRightStyle: 'solid', }}>
                        <StyledButton onClick={() => deleteTask(task.id)}
                            variant="text">Удалить</StyledButton>
                    </ButtonBox>
                    <ButtonBox>
                        <StyledButton onClick={() => selectTask({ id: task.id })}
                            variant="text">Редактировать</StyledButton>
                    </ButtonBox>
                </Stack>

            </Box>

        </Popover>
    </>
}

export default CustomTooltip
