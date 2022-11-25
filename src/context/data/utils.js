import dayjs from 'dayjs';
import { blue,deepOrange, green,blueGrey } from '@mui/material/colors';

export const eventColor= (tip, status=1)=> {
    if (!tip || !status) return blueGrey[700]
    switch(tip.toString()) {
        case '1': 
        return blue[800]
        case '2': 
        return green[800]
        case '3': 
        if (status.toString()==='3') return blueGrey[300]
        else return blueGrey[800]
        default:
            return blueGrey[700]
        }
    }


export const createStringDate = (date) => {
    return dayjs(date).format('YYYY-MM-DDTHH:mm:ssZ')
}
export const createStringDates = (start, end, allDay, dayToAdd = 1) => {
    const dateStartString = createStringDate(start)
    if (dayjs(start).isSame(end,'minute')) return { start: dateStartString, end: "" }
    const dateEndString = allDay
        ? createStringDate(addDay(end, dayToAdd))
        : createStringDate(end)
    return { start: dateStartString, end: dateEndString }
}


export const addDay = (date, days = 1) => {
    return dayjs(date).add(days, 'd')
}

export const DateToHumanString = (date, allDay, isEndate = false) => {

    if (!dayjs(date).isValid()) return ""
    try {
        let newDate = dayjs(date)
        if (allDay && isEndate) newDate = newDate.add(-1, 'd')

        return newDate.format(allDay ? 'DD.MM.YYYY' : 'DD.MM.YYYY HH:mm') || ""
    } catch (error) {
        return ""
    }
}

export const createEndDate = (start, end, allDay) => {
    const dateStart = dayjs(start)
    if (!end) return ""
    const dateEnd = dayjs(end)
    if (allDay && dateEnd.hour() === 0) {
        const dateEndNew = dateEnd.add(-1, 'd')
        if (dateStart.isSame(dateEndNew, 'day')) {
            return ""
        }
        return dateEnd.format('YYYY-MM-DDTHH:mm:ssZ')
    }
    return dateEnd.format('YYYY-MM-DDTHH:mm:ssZ')
}

export const createEndDateForm = (start, end, allDay) => {
    const dateStart = dayjs(start)
    if (!end) return dateStart
    const dateEnd = dayjs(end)
    if (allDay) {
        const dateEndNew = dateEnd.add(-1, 'd')
        return dateEndNew
    }

    return dateEnd
}

export const createEndDateNew = (startStr, startDate, endDate) => {
    const start = dayjs(startStr)
    const dateStart = dayjs(startDate)
    const dateEnd = dayjs(endDate)

    if (dateStart.add(1, 'd').isSame(dateEnd,'minute')) return start.format('YYYY-MM-DDTHH:mm:ssZ')
    let diff = 1
    if (!!endDate && dateEnd.isValid()) {
         diff = dateEnd.diff(dateStart, 'h')
    }
    return start.add(diff, 'h').format('YYYY-MM-DDTHH:mm:ssZ')
}

export const getExtendedPropertys = (ev, users) => {

    if (!ev) return ev
    let newEvent = {
        ...ev,
        allDay: ev.all_day === 'true',
        extendedProps: {
            id: ev.upn,
            comment: ev.comment,
            tip: ev.tip,
            status: ev.status,
            sendMattermost: ev.send_mattermost
        }
    }
    delete newEvent.upn
    delete newEvent.idc
    delete newEvent.all_day
    delete newEvent.send_mattermost
    delete newEvent.tip
    delete newEvent.status
    delete newEvent.comment
    if (!users) return newEvent
    const ADUserFinded = users.find(user => (user.userPrincipalName === newEvent.extendedProps.id))
    if (!ADUserFinded) {
        newEvent.extendedProps.notfound = true
        return newEvent
    }
    newEvent.title = ADUserFinded.displayName
    newEvent.extendedProps.telephoneNumber = ADUserFinded.telephoneNumber
    newEvent.extendedProps.title = ADUserFinded.title
    newEvent.extendedProps.mobile = ADUserFinded.mobile
    newEvent.extendedProps.mail = ADUserFinded.mail
    newEvent.extendedProps.notfound = false
    return newEvent
};