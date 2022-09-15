import * as React from 'react';
import {useState, useEffect, useMemo} from "react";
import  { Draggable } from '@fullcalendar/interaction';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';


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
        <Box sx={{width: '100%'}}>
        <Typography  color="text.secondary" sx={{ fontSize:'0.9rem', mb:1 }}>
        {name}
         </Typography>

            <Box sx={{
                  margin: '0 auto',
                  marginTop: '1em',
                  maxWidth: '95%',
                  display: 'block',
                  overflowY: 'auto',
                  height:'700px'
            }}>
                <div id="workOrderContainer" >
                  {users.map((user) => (
                      <UserMiniCard user={user} key={user.userPrincipalName}/>
                  ))}
              </div>
            </Box>
        </Box>
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