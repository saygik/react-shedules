import * as React from 'react';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { styled, useTheme } from '@mui/material/styles';

import {drawerWidth} from '../../utils'
import {useAuth0} from '../../context/auth0'


const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})  (({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
    paddingTop:0,
    paddingBottom:0,
}));
export default function Bar({open, setOpen, login}) {
const {loginWithRedirect, logout, isAuthenticated}=useAuth0()
    const handleDrawerOpen = () => {
        setOpen(true);
      };
       
    return (
        <Box sx={{ flexGrow: 1 }}>
    <AppBar position="fixed" open={open}>
        <Toolbar>
            <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{ mr: 2, ...(open && { display: 'none' }) }}
            >
                <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            График дежурств
            </Typography>
            {!isAuthenticated && <Button onClick={()=>loginWithRedirect()} sx={{ fontWeight: 600 }} color="inherit">вход</Button>}
            {isAuthenticated && <Button onClick={()=>logout()} sx={{ fontWeight: 600 }} color="inherit">выход</Button>}
        </Toolbar>
    </AppBar>
    </Box>
    )
}
