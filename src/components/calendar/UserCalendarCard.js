import * as React from 'react';

export default function UserCalendarCard(props) {
    const {name, title, telephoneNumber, mobile, notfounded}=props
    return (
        <div  className="calendarEvent" style={{cursor: 'pointer'}}>
            <div className={"title"} >
                {title}
            </div>
            <div className={!notfounded ? "eventName": "eventError"} >
                {name}
            </div>
            {/*{telephoneNumber &&*/}
            {/*    <div className={"telephoneNumber"}>*/}
            {/*        тел.{telephoneNumber}*/}
            {/*    </div>*/}
            {/*}*/}
            {/*{mobile &&*/}
            {/*    <div className={"telephoneNumber"}>*/}
            {/*        моб.{mobile}*/}
            {/*    </div>*/}
            {/*}*/}
        </div>
    )
}