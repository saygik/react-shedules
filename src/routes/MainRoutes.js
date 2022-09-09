import CallBoards from '../views/CallBoards';
import NotFound from '../views/NotFound';
import Dashboard from '../views/Dashboard'


// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = [
    {path: '/',    element: <Dashboard />},
    {path: 'schedulenotfound',    element: <NotFound />},
    {path: 'schedule/:id', element: <CallBoards />},
    {path: '*',    element:<NotFound />}
];

export default MainRoutes;
