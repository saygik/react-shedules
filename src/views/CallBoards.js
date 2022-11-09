import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import MainCalendar from "../components/calendar/MainCalendar";
import {  useEffect } from "react";
import { useParams } from "react-router-dom"
import { isInt } from '../utils'
import { useData } from '../context/data/';
import NotFound from './NotFound';
import Loader from '../components/Loader'
import Bar from '../components/menu/Bar'
import Sidebar from '../components/menu/Sidebar'
import EventForm from '../components/forms/EventForm'

function CallBoards() {
    const { id } = useParams()
    const {  selectors: {sortedUsers, scheduleName, loading, loaded}, getSchedule } = useData()

    const [openForm, setOpenForm] = React.useState(false);
    const handleFormOpen = () => {
        setOpenForm(true);
    };

    const handleFormClose = () => {
        setOpenForm(false);
    };

    //    const [isAdmin, setAdmin]=useState(true)
    const [open, setOpen] = React.useState(false);

    useEffect(() => {
        if (isInt(id)) getSchedule(id)
    }, []);// eslint-disable-line react-hooks/exhaustive-deps

    if (!isInt(id)) return <NotFound />

    if (loading) return <Loader />
    if (!loading && !loaded) return <NotFound />


    return (
        <Box sx={{ pt: 7 }}>
            <CssBaseline />
            <Bar open={open} setOpen={setOpen} />
            <Sidebar open={open} setOpen={setOpen} users={sortedUsers} name={scheduleName} />
            <main>
                    <MainCalendar
                        open={open}
                        id={id}
                        type="trigger"
                        handleFormOpen={handleFormOpen} 
                        />
            </main>
            <EventForm open={openForm} handleClose={handleFormClose} />
        </Box>
    );
}

export default CallBoards;
