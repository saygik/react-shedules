import React, {useEffect, useState, useRef, useMemo, useCallback} from "react";
import FullCalendar, {formatDate} from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import ruLocale from '@fullcalendar/core/locales/ru';
import UserCalendarCard from '../UserCalendarCard';
import {INITIAL_EVENTS, createEventId} from '../event-utils';
import {  toast } from 'react-toastify';
import api from "../../api";

function inElement(point, element) {
    const rect = element.getBoundingClientRect();
    const top = rect.top + window.scrollY;
    const bottom = rect.bottom + window.scrollY;
    const left = rect.left + window.scrollX;
    const right = rect.right + window.scrollX;

    return point.x >= left && point.x <= right && point.y >= top && point.y <= bottom;
}
const MainCalendar = (props) => {
    const {users, tasks, id, setShowPopupCard}=props
    const calendarContainer = useRef(null);
    const [weekendsVisible] = useState(true)
    const [events, setevents] = useState([])
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
            toast.success('?????????????? ??????????????????!', );
        } catch (e) {
            console.log(e)
            toast.error('?????????????? ???? ??????????????????!', );
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
                toast.info('?????????????? ????????????????!' );
            }
        } catch (e) {
            console.log('err',e)
            UpdateEventDate(oldEvent)
            toast.error('?????????????? ???? ????????????????!' );
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
    const handleEventClick = (clickInfo) => {
        //clickInfo.event.remove()
    }
    const handleEvents = (events) => {
     //   console.log('---------------', events)
//        setCurrentEvents(events)
    }
    const handleEventMouseHover = (clickInfo) => {
//        console.log('on', clickInfo)
          setShowPopupCard(true)
      }
      const handleEventMouseLeave = (clickInfo) => {
//        console.log('on', clickInfo)
          setShowPopupCard(false)
      }
    const renderCellContent  = (eventInfo) => {
    const weekday=eventInfo.date.getDay()
    const weekend=(weekday===0 || weekday===6)

    return (
            <span className="bg" style={{color:weekend ? '#b20606':'#1a8fff'}}>{eventInfo.dayNumberText}</span>
    )
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
                toast.info('?????????????? ??????????????!', );            }
        } catch (e) {
            console.log('err',e)
            toast.error('?????????????? ???? ??????????????!' );
        }

//        event.remove();
    }
    return (
        <div className="calendar" ref={calendarContainer}>
            <FullCalendar
                timeZone= {'UTC'}
//                businessHours={{daysOfWeek: [ 1, 2, 3, 4,5 ]}}                   //?????????????? ????????
                locale={ruLocale}                                                //????????
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                headerToolbar={{
                    left: '',
                    center: 'title',
                    right: 'prev,today,next'
                }}
                titleFormat= {{ year: 'numeric', month: 'long'}}                //????????????
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
                eventsSet={handleEvents} // called after events are initialized/added/changed/removed
                eventColor= 'rgba(0,0,0,0.05)'
                droppable={true}
                eventAdd={function(addInfo ) {
                    console.log('eventAdd', addInfo )
                }}
                eventChange={handleEventUpdate}
                eventReceive={handleEventReceive}
                eventDragStop={handleEventDragStop}
                eventMouseEnter={handleEventMouseHover}
                eventMouseLeave={handleEventMouseLeave}
                /* you can update a remote database when these fire:
                eventAdd={function(){}}
                eventChange={function(){}}
                eventRemove={function(){}}
                */
            />
        </div>
    );
}

export default MainCalendar;
