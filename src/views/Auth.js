import * as React from 'react';
import { useEffect } from 'react';
import { useLocation } from "react-router-dom";
import {useAuth0} from '../context/auth0'
import Loader from '../components/Loader'

function Auth() {
    const {onRedirectCallback}=useAuth0()
    const search = useLocation().search; 
    const code = new URLSearchParams(search).get('code');
    const state = new URLSearchParams(search).get('state') || "/";

    useEffect(() => {
        onRedirectCallback(code,state)
//        navigate("/schedule/2");
    }, [code]);// eslint-disable-line react-hooks/exhaustive-deps

    // useEffect(() => {
    //     const  getuser = async (token) => {
    //         //console.log('------------token--------------', token)
    //         if (!token) return
    //         const result = await api.loginuser(token)
    //        console.log(result)
    //     }
    //     getuser(token)
    //     navigate("/schedule/2");
    // }, [token]);
    return (
        <Loader/>
    )
}
export default Auth;
