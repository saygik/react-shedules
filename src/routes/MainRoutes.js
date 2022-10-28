import CallBoards from '../views/CallBoards';
import NotFound from '../views/NotFound';
import Dashboard from '../views/Dashboard'
import Auth from '../views/Auth'


// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = [
    {path: '/',    element: <Dashboard />},
    {path: '/auth',    element: <Auth />},
    {path: 'schedulenotfound',    element: <NotFound />},
    {path: 'schedule/:id', element: <CallBoards />},
    {path: '*',    element:<NotFound />}
];

export default MainRoutes;
