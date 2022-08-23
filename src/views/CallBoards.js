import '../App.css';
import MainCalendar from "../components/MainCalendar";
import Sidebar from "../components/Sidebar";
import {useState, useEffect, useMemo, useCallback} from "react";
import api from '../api/index'


function CallBoards() {
    const [users, setUsers]=useState([])
    const [tasks, setTasks]=useState([])

    const [isAdmin, setAdmin]=useState(true)
    const getSchedule = useCallback(async ()=>{
        const result = await api.getSchedules(1)
        if (result && result.status===200) {
            setTasks(result.data.data)
        }
    }, []);
    useEffect( ()=>{
        const getUsers=async () => {
            const result = await api.getAdUserInGroup("brnv.rw", "CN=adusersDomainAdmins,OU=WWW-ADUSERS,OU=Служебные пользователи,OU=_Служебные записи,DC=brnv,DC=rw")
//            const result = await api.getAdUserInGroup("brnv.rw", "CN=Администраторы компьютеров Сх НОД-2,OU=AD,OU=Служебные пользователи,OU=_Служебные записи,DC=brnv,DC=rw")
            if (result && result.status===200) {
                setUsers(result.data.data)
            }
        }
        // const getSchedule = async () => {
        //     const result = await api.getSchedules(1)
        //     console.log('result',result)
        //     if (result && result.status===200) {
        //         setTasks(result.data.data)
        //     }
        // }
        getUsers()
        getSchedule()
    },[])
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
                    <MainCalendar users={users} tasks={tasks}/>
                </div>
            </main>
        </div>
    );
}

export default CallBoards;
