let eventGuid = 0
let todayStr = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today
let tomorrow = new Date()
tomorrow.setDate(tomorrow.getDate() + 2)
let tomorrows = tomorrow.toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today
export const INITIAL_EVENTS = [
    {
        id: createEventId(),
        title: 'Крапивин',
        extendedProps:{
            id :"say@brnv.rw",
            telephoneNumber:"300000"
        },
        start: todayStr
    }

    ,
    {
        id: createEventId(),
        title: 'Русак Кирилл',
        extendedProps:{
            id :"rusakkl@brnv.rw",
            tel:"500000"
        },
        start: tomorrows
    }
]

export function createEventId() {
    return String(eventGuid++)
}