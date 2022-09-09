import * as React from 'react';
import {useState, useEffect, useMemo} from "react";
import  { Draggable } from '@fullcalendar/interaction';

// const INIT=[
//     {id: 1, title: 'Крапивин Игорь Викторович'},
//     {id: 2, title: 'Русак Кирилл Леонтьевич'},
//     {id: 3, title: 'Пивоварчик Дмитрий Владимирович'}
// ]
export default function Sidebar(props) {
    const {users, name}=props
    const [draggableInitialized, setDraggableInitialized] = useState(false)
//    const [users] = useState(INIT)
    const mapUsers=useMemo(()=>{
        return users.reduce(function(map, obj) {
            map[obj.userPrincipalName] = obj
            return map;
        }, {})
    },[users])
    useEffect(() => {
        const element = document.getElementById('workOrderContainer')

        if (element && users.length > 0 && !draggableInitialized) {
            setDraggableInitialized(true)

            new Draggable(element, {
                itemSelector: '.draggableEvent',
                eventData: (eventElement) => {
                    const workOrderId = eventElement.id
                    return {
                        title: mapUsers[workOrderId].cn,
                        extendedProps: {
                            id: workOrderId,
                            telephoneNumber: mapUsers[workOrderId].telephoneNumber,
                            title: mapUsers[workOrderId].title,
                            mobile: mapUsers[workOrderId].mobile
                        }
                    };
                }
            })
        }
    }, [users, draggableInitialized])

    return (
        <div className={"sidebar"}>
            <div id="sidebarLogo">
                    <span>
                        {name}
                    </span>
            </div>
            <div className={"body"}>
                <div id="workOrderContainer" >
                  {users.map((user) => (
                      <UserMiniCard user={user} key={user.userPrincipalName}/>
                  ))}
              </div>
            </div>
        </div>
    );
};

function UserMiniCard(props) {
    const {user}=props
    return (
        <div id={user.userPrincipalName} className="draggableEvent" style={{cursor: 'pointer'}}>
            <span >
                {user.title}
            </span>
            <div >
                {user.cn}
            </div>
        </div>
    )
}