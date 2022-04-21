import React, { Fragment, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import avatar from './img/avatar.jpg';
import { APP_URL } from '../../constants';
import { Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
    chatSection: {
        width: '100%',
        height: '80vh'
    },
    headBG: {
        backgroundColor: '#e0e0e0'
    },
    borderRight500: {
        borderRight: '1px solid #e0e0e0'
    },
    messageArea: {
        height: '70vh',
        overflowY: 'auto'
    }
});

const ChatRooms = (props) => {

    const classes = useStyles();
    const [chatrooms, setChatrooms] = useState([]);
    const history = useHistory();

    useEffect(() => {
        console.log('currentuser ======>', props.currentUser)
        const { user_id } =  props.currentUser;
        // fetch(`${APP_URL}/api/chatrooms`, {
        fetch(`${APP_URL}/chatrooms`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("jwt_token")}`,
            } 
        })
        .then(response => response.json())
        .then(data => {
            var chatrooms = data.data;
            // console.log(chatrooms)
            // if(chatrooms.length > 0 && chatrooms !== undefined) {
            if(chatrooms !== null) {
                setChatrooms(chatrooms);
                props.updateCurrentUserRooms(data.data);
            }
        })
    }, [])

    const handleClick = (chatroom) => {
        history.push(`/chatroom/${chatroom.id}`)
    }

    return (
        <Fragment>
            {
                (chatrooms.length !== 0 && chatrooms.length !== undefined) ? 
                    (<div>
                        <Grid container>
                            <Grid item xs={12} >
                                <Typography variant="h5" className="header-message">Chat</Typography>
                            </Grid>
                        </Grid>
                        <Grid container component={Paper} className={classes.chatSection}>
                            <Grid item xs={12} className={classes.borderRight500}>
                                <List>
                                    <ListItem button key={props.currentUser.email}>
                                        <ListItemIcon>
                                        <Avatar alt={props.currentUser.email} src={avatar} />
                                        </ListItemIcon>
                                        <ListItemText primary={props.currentUser.email}></ListItemText>
                                    </ListItem>
                                </List>
                                <Divider />
                                    <Grid item xs={12} style={{padding: '10px'}}>
                                        <TextField id="outlined-basic-email" label="Search" variant="outlined" fullWidth />
                                    </Grid>
                                <Divider />
                                <List>
                                {chatrooms.map((room) => {
                                    return (    
                                        <div>
                                            <ListItem button key={room.id}>
                                                <ListItemIcon>
                                                    <Avatar alt={room.title} src={room.title} />
                                                </ListItemIcon>
                                                <ListItemText primary={room.title}>{room.title}</ListItemText>
                                                <Button variant="contained" color="primary" onClick={() => handleClick(room)}>
                                                    Start Chat
                                                </Button>
                                            </ListItem>
                                        </div>
                                    )
                                })}
                                </List>
                            </Grid>
                        </Grid>
                    </div>) :
                    (<div>
                        <h1>Please Create a Room to Chat With friends :)</h1>
                    </div>)
            }
        </Fragment>
    )  
}

export default ChatRooms;