import '../App.css';
import MainCalendar from "../components/MainCalendar";
import Sidebar from "../components/Sidebar";
import {useState, useEffect, useMemo, useCallback} from "react";
import { useParams, useNavigate } from "react-router-dom"
import api from '../api/index'
import {isInt} from '../utils'
import { useShedules } from '../context/data/';


function CallBoards() {
    let navigate = useNavigate()
    const {id} = useParams()
    const {getScheduleTasks, getSchedule, tasks}=useShedules()
    const [users, setUsers]=useState([])
//    const [tasks, setTasks]=useState([])
    const [isAdmin, setAdmin]=useState(true)
    useEffect( ()=>{
        if (!isInt(id)) navigate("/shedulenotfound")
      //  getScheduleTasks(id)
        getSchedule(id)
    },[id])


    const sortedUsers=useMemo(()=>{
        return users.sort((a,b) => {
            const fa = a.displayName.toLowerCase();
            const fb = b.displayName.toLowerCase();
            if (fa < fb) {
                return -1;
            }
            if (fa > fb) {
                return 1;
            }
            return 0;
        })
    },[users])

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
                    <Sidebar users={sortedUsers}/>
                </div>
                <div className="col">
                    <MainCalendar users={users} tasks={tasks} id={id}/>
                </div>
            </main>
        </div>
    );
}

export default CallBoards;
