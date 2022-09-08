
import CallBoards from '../views/CallBoards';
import NotFound from '../views/NotFound';


// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = [
    {path: '/',    element: <CallBoards />},
    {path: 'shedulenotfound',    element: <NotFound />},
    {path: 'shedule/:id', element: <CallBoards />},
    {path: '*',    element:<NotFound />}
];

export default MainRoutes;
