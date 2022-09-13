import '../App.css';
import MainCalendar from "../components/MainCalendar";
import Sidebar from "../components/Sidebar";
import {useState, useEffect, useMemo, useCallback} from "react";
import { useParams, useNavigate } from "react-router-dom"
import api from '../api/index'
import {isInt} from '../utils'
import { useShedules } from '../context/data/';
import NotFound from './NotFound';
import Loader from '../components/Loader'


function CallBoards() {
    let navigate = useNavigate()
    const {id} = useParams()
    const {getScheduleTasks, getSchedule, tasks, users, sortedUsers, loading, loaded, name}=useShedules()

    const [isAdmin, setAdmin]=useState(true)
    useEffect( ()=>{
        if (isInt(id)) getSchedule(id)
    },[])

   if (!isInt(id)) return <NotFound />

   if (loading) return <Loader/>      
   if (!loading && !loaded) return <NotFound />
    return (
        <div className="App">
            <header>
                <div id="logo">
          <span>
              <b>график</b>  дежурств
            </span>

                </div>
            </header>
            <main>
                <div className="LeftPane" style={{display:isAdmin ? 'block': 'none'}}>
                    <Sidebar users={sortedUsers} name={name} />
                </div>
                <div className="col">
                    <MainCalendar users={users} tasks={tasks} id={id}/>
                </div>
            </main>
        </div>
    );
}

export default CallBoards;
