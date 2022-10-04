import React, {useEffect, useState, useRef, useMemo, useCallback} from "react";
import Box from '@mui/material/Box';
import FullCalendar, {formatDate} from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import ruLocale from '@fullcalendar/core/locales/ru';
import UserCalendarCard from './UserCalendarCard'
import {INITIAL_EVENTS, createEventId} from '../event-utils'
import {  toast } from 'react-toastify';
import { styled } from '@mui/material/styles';
import {drawerWidth} from '../../utils'
import api from "../../api";
import './calendar.css';


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
})  (({ theme, weekend }) => ({
    fontWeight: '700',
    lineHeight: '1',
    opacity: '0.10',
    fontSize: '4em',
    position: 'absolute',
    top: '-0.02em',
    right: '0.1em',
    transition: '0.25s ease-out',
    letterSpacing: '-0.07em',
    color:'#1a8fff',
    '&:hover': {
        opacity: '0.65',
        transition: '0.4s ease-in'
     },    
    ...(weekend && {color:'#b20606'}),
}));

const Container = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'open',
})  (({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginTop:'20px',
    padding:'0 10px',
    borderStyle: 'none',
    ...(open && {
        paddingLeft: `calc(10px + ${drawerWidth}px)`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
    paddingTop:0,
    paddingBottom:0,
}));


const MainCalendar = (props) => {
    const {users, tasks, id, setPopupCard, open}=props

    const calendarContainer = useRef(null);
    const [weekendsVisible] = useState(true)
    const [events, setevents] = useState([])
    const [isEventClicked, setEventClicked] = useState(false)
    const [isEventHover, setEventHover] = useState(false)

    // const events= useMemo(()=>{
    //     if (!tasks) return
    //     const newtasks=tasks.map(task=>{
    //         const newtask={...task,  extendedProps:{id:task.upn}}
    //         delete newtask.upn
    //         delete newtask.idc
    //         return newtask
    //     })
    //     if (!users) return newtasks
    //     const newEvents=newtasks.map(ev=>{
    //         const ADUserFinded=users.find(user=>(user.userPrincipalName===ev.extendedProps.id))
    //         let newEvent={...ev}
    //         if (!ADUserFinded ) {
    //             newEvent.extendedProps.notfound=true
    //             return newEvent
    //         }
    //         newEvent.title=ADUserFinded.displayName
    //         newEvent.extendedProps.telephoneNumber=ADUserFinded.telephoneNumber
    //         newEvent.extendedProps.title=ADUserFinded.title
    //         newEvent.extendedProps.mobile=ADUserFinded.mobile
    //         newEvent.extendedProps.notfound=false
    //         return newEvent
    //     })
    //     return newEvents
    // }, [tasks, users])
    const getExtendedPropertys = useCallback((ev)=>{
        const ADUserFinded=users.find(user=>(user.userPrincipalName===ev.extendedProps.id))
        let newEvent={...ev}
        if (!ADUserFinded ) {
            newEvent.extendedProps.notfound=true
            return newEvent
        }
        newEvent.title=ADUserFinded.displayName
        newEvent.extendedProps.telephoneNumber=ADUserFinded.telephoneNumber
        newEvent.extendedProps.title=ADUserFinded.title
        newEvent.extendedProps.mobile=ADUserFinded.mobile
        newEvent.extendedProps.notfound=false
        return newEvent
    }, [users]);
    useEffect(()=>{
        if (!tasks) return
        const newtasks=tasks.map(task=>{
            const newtask={...task,  extendedProps:{id:task.upn}}
            delete newtask.upn
            delete newtask.idc
            return newtask
        })
        if (!users) return         setevents(newtasks)
        const newEvents=newtasks.map(ev=>{
            return getExtendedPropertys(ev)
        })
        setevents(newEvents)
    }, [tasks, users])

    const DeleteEventById =(id)=>{
        setevents(
            events.filter(evt=>evt.id!=id)
        )
    }
    const UpdateEventDate =(oldEvent)=>{
        setevents(
            events.map(evt=>evt.id===oldEvent.id ? {...evt,allDay:true, start: oldEvent.start, end: oldEvent.end}: evt )
        )
    }
    const AddEvent =(event)=>{
        setevents(
            [...events,getExtendedPropertys(event)]
        )
    }
    const handleEventReceive = async (arg)=> {
        try {
            const result=await api.addTask(id,arg.event.title,arg.event.extendedProps.id, arg.event.startStr,"")

            if (result.data.id !== undefined) {

                AddEvent({ title: arg.event.title, allDay: true, start: arg.event.start, extendedProps: {id: arg.event.extendedProps.id}, id: result.data.id})
                arg.event.remove()
            }
            toast.success('Событие добавлено!', );
        } catch (e) {
            console.log(e)
            toast.error('Событие не добавлено!', );
            arg.event.remove()

        }

//        newEvent.id=createEventId()
//        setCurrentEvents([...currentEvents,newEvent])
    }
    const handleEventUpdate = async ({event,oldEvent} ) =>{
        try {
            const result = await api.updateTask(event.id, event.startStr, !event.end ? "": event.endStr)
            if (result.status===200) {
                UpdateEventDate(event)
                toast.info('Событие изменено!' );
            }
        } catch (e) {
            console.log('err',e)
            UpdateEventDate(oldEvent)
            toast.error('Событие не изменено!' );
        }

    }
    const handleDateSelect = (selectInfo) => {
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
    const renderCellContent  = (eventInfo) => {
    const weekday=eventInfo.date.getDay()
    const weekend=(weekday===0 || weekday===6)

    return <DayBox weekend={weekend}>{eventInfo.dayNumberText}</DayBox>
}
    const renderEventContent = (eventInfo) =>{
        return (
            <UserCalendarCard
                name={eventInfo.event.title}
                title={eventInfo.event.extendedProps.title}
                telephoneNumber={eventInfo.event.extendedProps.telephoneNumber}
                mobile={eventInfo.event.extendedProps.mobile}
                notfounded={eventInfo.event.extendedProps.notfound}
            />

        )
    }
    const handleEventDragStop = async ({ event, jsEvent }) =>{
        if (!calendarContainer.current) return;
        if (inElement({ x: jsEvent.pageX, y: jsEvent.pageY }, calendarContainer.current)) return;
        try {
            const result = await api.deleteTask(event.id)
            if (result.status===200) {
                DeleteEventById(event.id)
                toast.info('Событие удалено!', );            }
        } catch (e) {
            console.log('err',e)
            toast.error('Событие не удалено!' );
        }

//        event.remove();
    }

    const handleEventMouseEnter = (clickInfo) => {
        if (!isEventHover) { 
        setTimeout(function(){
            setPopupCard(clickInfo.event)     
            setEventHover(false)
        }, 250); 
        setEventHover(true)        
        }
        //clickInfo.event.remove()
        //setPopupCard(clickInfo.event)
    }
    const handleEventMouseLeave = (clickInfo) => {
        //clickInfo.event.remove()
        setEventHover(false)
        setPopupCard(null)
    }
    const handleEventClick = (clickInfo) => {
        if (isEventClicked) {
            setPopupCard(null)
            alert(
                'Clicked ' + clickInfo.event.title + '.\n' +
                'Will open ' + clickInfo.event.url + ' in a new tab'
              );
        } else {
            setEventClicked(true)
            setPopupCard(null)
//            setPopupCard(clickInfo.event)            
        }

        setTimeout(function(){
            setEventClicked(false)
        }, 250);        


    }
    const handleEvents = (events) => {
     //   console.log('---------------', events)
//        setCurrentEvents(events)
    }
    return (
        <Container ref={calendarContainer} open={open} >
            <FullCalendar
                timeZone= {'UTC'}
//                businessHours={{daysOfWeek: [ 1, 2, 3, 4,5 ]}}                   //Рабочие часы
                locale={ruLocale}                                                //Язык
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                headerToolbar={{
                    left: '',
                    center: 'title',
                    right: 'prev,today,next'
                }}
                titleFormat= {{ year: 'numeric', month: 'long'}}                //Формат
                dayHeaders={true}
                dayHeaderFormat= {{  weekday: 'long' }}
                initialView='dayGridMonth'
//                datesSet={(args) => console.log("###datesSet:", args)}
                height = '750px'
                editable={true}
                selectable={true}
                selectMirror={true}
                dayMaxEvents={true}
                weekends={weekendsVisible}
                events={events} // alternatively, use the `events` setting to fetch from a feed
                select={handleDateSelect}
                eventContent={renderEventContent} // custom render function
                dayCellContent={renderCellContent}
                eventClick={handleEventClick}
                eventCl
                eventsSet={handleEvents} // called after events are initialized/added/changed/removed
                eventColor= 'rgba(0,0,0,0.05)'
                eventTextColor = '#444'
                droppable={true}
                eventAdd={function(addInfo ) {
                    console.log('eventAdd', addInfo )
                }}
                eventChange={handleEventUpdate}
                eventReceive={handleEventReceive}
                eventDragStop={handleEventDragStop}
                eventMouseEnter={handleEventMouseEnter}
                eventMouseLeave={handleEventMouseLeave}

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
