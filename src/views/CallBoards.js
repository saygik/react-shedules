import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import MainCalendar from "../components/calendar/MainCalendar";
import {useState, useEffect, useMemo, useCallback} from "react";
import { useParams, useNavigate } from "react-router-dom"
import {isInt} from '../utils'
import { useShedules } from '../context/data/';
import NotFound from './NotFound';
import Loader from '../components/Loader'
import PopupCard from '../components/cards/Usercard'
import Hover from '../components/Hover'
import Bar from '../components/menu/Bar'
import Sidebar from '../components/menu/Sidebar'
import '../App.css';

function CallBoards() {
    let navigate = useNavigate()
    const {id} = useParams()
    const { getSchedule, tasks, users, sortedUsers, loading, loaded, name}=useShedules()
    const [popupCard, setPopupCard] = useState(null);
//    const [isAdmin, setAdmin]=useState(true)
    const [open, setOpen] = React.useState(false);

    useEffect( ()=>{
        if (isInt(id)) getSchedule(id)
    },[])

   if (!isInt(id)) return <NotFound />

   if (loading) return <Loader/>      
   if (!loading && !loaded) return <NotFound />


    return (
        <Box sx={{ pt:7 }}>
        <CssBaseline />
        <Bar open={open} setOpen={setOpen}/>
        <Sidebar open={open} setOpen={setOpen} users={sortedUsers}  name={name}/>
            <main>
                <div className="col" >
                {/* <PopupCard type="hover" popupCard={{title:'Пивоварчик Дмитрий Владимирович', extendedProps:{title:'администратор баз данных', telephoneNumber:'493668'}}}/>          */}
                <Hover shiftX={310} shiftY={175}  showPopup={!!popupCard}>
                        <PopupCard type="hover" popupCard={popupCard}/>         
                        <MainCalendar open={open} users={users} tasks={tasks} id={id} type="trigger" setPopupCard={setPopupCard}/>           
                    </Hover>
                </div>
            </main>
        </Box>
    );
}

export default CallBoards;
