import { styled, useTheme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import InboxPerson from '@mui/icons-material/Person';
import MailIcon from '@mui/icons-material/Mail';
import { useState, useEffect, useMemo } from "react";
import { Draggable } from '@fullcalendar/interaction';
import { drawerWidth } from '../../utils'
import { blueGrey } from '@mui/material/colors';



const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

function Sidebar({ open, setOpen, users }) {
    const theme = useTheme();
    const handleDrawerClose = () => {
        setOpen(false);
    };
    return (
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
            }}
            variant="persistent"
            anchor="left"
            open={open}
        >
            <DrawerHeader>
                <IconButton onClick={handleDrawerClose}>
                    {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>
            </DrawerHeader>
            <Divider />
            <List>
                <div id="workOrderContainer" >
                    {!!users && users.map((user) => (
                        <ListItem key={user.userPrincipalName} disablePadding className='draggableEvent' id={user.userPrincipalName}>
                            <ListItemButton sx={{p:0}}>
                                <ListItemIcon sx={{minWidth:30}}>
                                    <InboxPerson /> 
                                </ListItemIcon>
                                <ListItemText 
                                primary={user.cn} primaryTypographyProps={{ sx: { fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden',textOverflow: 'ellipsis' } }}
                                secondary={user.title} secondaryTypographyProps={{ sx: { color: blueGrey[400], fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden',textOverflow: 'ellipsis' } }}/>
                            </ListItemButton>
                        </ListItem>
                    ))}
                     white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
                    {/* {!!users && users.map((user) => (
                      <UserMiniCard user={user} key={user.userPrincipalName}/>
                  ))} */}
                </div>

            </List>
            <Divider />
        </Drawer>
    );
}

export default function SidebarContainer(props) {
    const { open, setOpen, users, name } = props
    const [draggableInitialized, setDraggableInitialized] = useState(false)
    const mapUsers = useMemo(() => {
        if (!users) return
        return users.reduce(function (map, obj) {
            map[obj.userPrincipalName] = obj
            return map;
        }, {})
    }, [users])
    useEffect(() => {
        const element = document.getElementById('workOrderContainer')

        if (users && element && users.length > 0 && !draggableInitialized) {
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
        <Sidebar open={open} setOpen={setOpen} users={users} />
    )
}

function UserMiniCard(props) {
    const { user } = props
    return (
        <div id={user.userPrincipalName} className="draggableEvent" style={{ cursor: 'pointer' }}>
            <span >
                {user.title}
            </span>
            <div >
                {user.cn}
            </div>
        </div>
    )
}