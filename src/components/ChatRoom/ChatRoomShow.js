import React, { Component, Fragment, useEffect, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Fab from '@material-ui/core/Fab';
import SendIcon from '@material-ui/icons/Send';
import avatar from './img/avatar.jpg';
import { APP_URL } from '../../constants';
import ChatMessage from './ChatMessage';
import ChatroomWebSocket from './ChatRoomWebSocket';

const styles = theme => ({
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


class ChatRoomShow extends Component {
    constructor(props) {
        super(props)
        this.state = {
            messageText: []
        }
    }

    handleChange = (e) => {
        e.preventDefault()
        this.setState({
            messageText: e.target.value
        })
    }   
    
    handleSendMessage = (e) => {
        e.preventDefault();
        
        const message = {
            body: this.state.messageText,
            chatroom_id: this.props.roomData.chatroom.id,
            user_id: this.props.currentUser.id
        }

        // fetch(`${APP_URL}/api/messages`, {
        fetch(`${APP_URL}/messages`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                'Authorization': `Bearer ${localStorage.getItem("jwt_token")}`,
            },
            body: JSON.stringify({
                // message: {
                    message: message,
                    // user_id: this.props.currentUser.id
                // }
            })
        })
        .then(resp => resp.json())
        .then(result => {
            let messageDiv = document.getElementById('messages')
            messageDiv.scrollTop = messageDiv.scrollHeight
            this.setState({
                messageText: ''
            })
        })
    }

    whichUser = (message) => {
        const user = this.props.roomData.users.data.find(user => user.id === message.user_id )
        return user
    }

    displayMessages = (messages) => {
        return messages.map(message => {
            const user = this.whichUser(message)
            return (
                message.body !== null ? 
                    <ChatMessage key={message.id} message={message} user={user} currentUser={this.props.currentUser}/> :
                    <div></div>
            )
        }) 
    }

    render() {
        const { classes } = this.props;
        console.log('messages ==>', this.props.roomData.messages)
        return(
            <Fragment>
                <div>
                    <Grid item xs={9}>
                        <List className={classes.messageArea}>
                            <ListItem key="1">
                                <Grid container>
                                    <Grid item xs={12}>
                                        <div id='chat-feed'>
                                            <h3>Chat Feed:</h3>
                                            <div id='messages'>
                                                { this.props.roomData.messages !== undefined && this.props.roomData.messages.length > 0 ? (
                                                    this.displayMessages(this.props.roomData.messages)
                                                ) : (
                                                    <h3>This room has no messages yet - be the first to post!</h3>
                                                ) }
                                            </div>
                                        </div>
                                    </Grid>
                                </Grid>
                            </ListItem>
                        </List>
                        <Divider />
                        <Grid container style={{padding: '20px'}}>
                            <Grid item xs={11}>
                                <TextField id="outlined-basic-email" label="Type Something" value={this.state.messageText} onChange={this.handleChange} fullWidth />
                            </Grid>
                            <Grid xs={1} align="right">
                                <Fab color="primary" aria-label="add" onClick={this.handleSendMessage}><SendIcon /></Fab>
                            </Grid>
                        </Grid>
                    </Grid>
    
                    <ChatroomWebSocket
                        cableApp={this.props.cableApp}
                        getRoomData={this.props.getRoomData}
                        roomData={this.props.roomData}
                        updateApp={this.props.updateApp}
                    />
                </div>
            </Fragment>
        )
    }
}

export default withStyles(styles)(ChatRoomShow);