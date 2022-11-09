import dayjs from 'dayjs';
export const createStringDate = (date) => {
    return dayjs(date).format('YYYY-MM-DDTHH:mm:ssZ')
}
export const createEndDate = (start, end, allDay) => {
    const dateStart = dayjs(start)
    if (!end) return ""
    const dateEnd = dayjs(end)
    if (allDay && dateEnd.hour() === 0) {
        const dateEndNew = dateEnd.add(-1, 's')
        if (dateStart.isSame(dateEndNew, 'day')) {
            return ""
        }
        return dateEnd.format('YYYY-MM-DDTHH:mm:ssZ')
    }
    return dateEnd.format('YYYY-MM-DDTHH:mm:ssZ')
}

export const createEndDateNew = (startStr, startDate, endDate, allDay) => {
    const start = dayjs(startStr)
    const dateStart = dayjs(startDate)
    const dateEnd = dayjs(endDate)
    const diff = dateEnd.diff(dateStart, 'h')

    if (allDay) {
        return ""
    }
    return start.add(diff,'h').format('YYYY-MM-DDTHH:mm:ssZ')
}

