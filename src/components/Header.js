import { Button } from '@material-ui/core';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));

const Header = (props) => {
    const classes = useStyles();
    const history = useHistory({});

    const handleLogin = () => {
        history.push('/auth/login');
    }

    const handleRegister = () => {
        history.push('/auth/register');
    }

    const handleCreateRoom = () => {
        history.push('/chatrooms/create')
    }

    return ( 
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                    <Button color="inherit" onClick={() => history.push('/')}>Chat App</Button>
                    </Typography> 
                    {props.currentUser && 
                        <Button color="inherit" onClick={handleCreateRoom}>Create ChatRoom</Button>
                    }

                    {!props.currentUser && 
                        <Button color="inherit" onClick={handleLogin}>Login</Button>
                    }
                    
                    {!props.currentUser && 
                        <Button color="inherit" onClick={handleRegister}>Register</Button>
                    }

                    {props.currentUser && 
                        <Button color="inherit" onClick={props.logout}>Logout</Button>
                    }
                </Toolbar>
            </AppBar>
        </div>
    );
}
 
export default Header;