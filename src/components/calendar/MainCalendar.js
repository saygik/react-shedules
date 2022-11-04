import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import Box from '@mui/material/Box';
import FullCalendar, { formatDate } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import ruLocale from '@fullcalendar/core/locales/ru';
import UserCalendarCard from './UserCalendarCard'
import CustomEvent from './customElements/CustomEvent'
import { INITIAL_EVENTS, createEventId } from '../event-utils'
import { toast } from 'react-toastify';
import { styled } from '@mui/material/styles';
import { drawerWidth } from '../../utils'
import api from "../../api";
import './calendar.css';
import { useData } from '../../context/data'

function inElement(point, element) {
    const rect = element.getBoundingClientRect();
    const top = rect.top + window.scrollY;
    const bottom = rect.bottom + window.scrollY;
    const left = rect.left + window.scrollX;
    const right = rect.right + window.scrollX;

    return point.x >= left && point.x <= right && point.y >= top && point.y <= bottom;
}

const DayBox = styled('span', {
    shouldForwardProp: (prop) => prop !== 'weekend',
})(({ theme, weekend }) => ({
    fontWeight: '700',
    lineHeight: '1',
    opacity: '0.10',
    fontSize: '4em',
    position: 'absolute',
    top: '-0.02em',
    right: '0.1em',
    transition: '0.25s ease-out',
    letterSpacing: '-0.07em',
    color: '#1a8fff',
    '&:hover': {
        opacity: '0.65',
        transition: '0.4s ease-in'
    },
    ...(weekend && { color: '#b20606' }),
}));

const Container = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginTop: '20px',
    padding: '0 10px',
    borderStyle: 'none',
    ...(open && {
        paddingLeft: `calc(10px + ${drawerWidth}px)`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
    paddingTop: 0,
    paddingBottom: 0,
}));


const MainCalendar = (props) => {
    const { id, open, handleFormOpen } = props
    const { deleteTask, updateTask, addTask, selectors } = useData()
    const { tasks } =selectors
    const calendarContainer = useRef(null);
    const [weekendsVisible] = useState(true)

    const handleEventReceive = async (arg) => {
        const newTask={
            id: id, 
            allDay:arg.event.allDay, 
            title: arg.event.title, 
            start: arg.event.startStr,
            startDate: arg.event._instance.range.start,
            endDate: arg.event._instance.range.end,
            extendedProps: { id: arg.event.extendedProps.id },
        }
       addTask(newTask)
       arg.event.remove()
    }
    const handleEventUpdate = async ({ event, oldEvent }) => updateTask(event)
    const handleDateSelect = (selectInfo) => {
        handleFormOpen()
        return
        let title = prompt('Please enter a new title for your event')
        let calendarApi = selectInfo.view.calendar

        calendarApi.unselect() // clear date selection
        if (title) {
            calendarApi.addEvent({
                id: createEventId(),
                title,
                start: selectInfo.startStr,
                end: selectInfo.endStr,
                allDay: selectInfo.allDay
            })
        }
    }
    const renderCellContent = (eventInfo) => {
        const weekday = eventInfo.date.getDay()
        const weekend = (weekday === 0 || weekday === 6)

        return <DayBox weekend={weekend}>{eventInfo.dayNumberText}</DayBox>
    }

    const handleEventDragStop = async ({ event, jsEvent }) => {
        if (!calendarContainer.current) return;
        if (inElement({ x: jsEvent.pageX, y: jsEvent.pageY }, calendarContainer.current)) return;
        deleteTask(event.id)

        //        event.remove();
    }
    return (
        <Container ref={calendarContainer} open={open} >
            <FullCalendar
                timeZone={'local'}
                //                businessHours={{daysOfWeek: [ 1, 2, 3, 4,5 ]}}                   //Рабочие часы
                locale={ruLocale}                                                //Язык
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                headerToolbar={{
                    left: 'dayGridMonth,timeGridWeek,timeGridDay',
                    center: 'title',
                    right: 'prev,today,next'
                }}
                titleFormat={{ year: 'numeric', month: 'long' }}                //Формат
                dayHeaders={true}
                dayHeaderFormat={{ weekday: 'long' }}
                initialView='dayGridMonth'
                //                datesSet={(args) => console.log("###datesSet:", args)}
                height='750px'
                editable={true}
                selectable={true}
                selectMirror={true}
                dayMaxEvents={true}
                weekends={weekendsVisible}
                events={tasks} // alternatively, use the `events` setting to fetch from a feed
                select={handleDateSelect}
                eventContent={(eventInfo)=><CustomEvent event={eventInfo.event} />} // custom render function
                dayCellContent={renderCellContent}
//                eventClick={handleEventClick}
                eventCl
//                eventsSet={handleEvents} // called after events are initialized/added/changed/removed
                eventColor='rgba(0,0,0,0.05)'
                eventTextColor='#444'
                droppable={true}
                // eventAdd={function (addInfo) {
                //     console.log('eventAdd', addInfo)
                // }}
                eventChange={handleEventUpdate}
                eventReceive={handleEventReceive}
                eventDragStop={handleEventDragStop}
                // eventMouseEnter={handleEventMouseEnter}
                // eventMouseLeave={handleEventMouseLeave}

            /* you can update a remote database when these fire:
            eventAdd={function(){}}
            eventChange={function(){}}
            eventRemove={function(){}}
            */
            />
        </Container>
    );
}

export default MainCalendar;
