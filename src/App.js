import './App.css';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import { isAuthenticated } from './utils'
import CreateRoom from './components/ChatRoom/CreateRoom';
import { APP_URL } from './constants';
import ChatRooms from './components/ChatRoom/ChatRooms';
import ChatRoomShow from './components/ChatRoom/ChatRoomShow';

class App extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            currentUser: null,
            currentUserRooms: [],
            currentRoom: {
                chatroom: [], 
                users: [],
                messages: []
            }
        }
    }

    updateCurrentUser = (data) => {
        this.setState({
            ...this.state,
            currentUser: data
        })
    }

    updateRooms = (data) => {
        // const userRooms = this.state.currentUserRooms;
        // let user = userRooms.concat(data.chatroom)
        // if (userRooms.includes(data.chatroom)){
        //     user = userRooms
        // }
        this.setState({
            ...this.state,
            currentRoom: {
                chatroom: data.chatroom,
                users: data.users
            },
            currentUserRooms: data.users
            // currentUserRooms: userRooms.includes(data.chatroom) ? userRooms : userRooms.concat(data.chatroom)
        })
    }

    updateCurrentUserRooms = (data) => {
        this.setState({
            ...this.state,
            currentUserRooms: data.chatrooms
        })
    }

    handleLogout = () => {
        console.log("LOGOUT")
        this.unsubscribeApperance(this.state.currentUser.user_id)
        localStorage.removeItem('jwt_token')
        this.setState({
          currentUser: null
        })

        return <Redirect to='/' />
    }

    unsubscribeApperance = (e) => {
        // const subscriptionIdentifier = "{\"channel\":\"AppearanceChannel\"}"
        // this.props.cableApp.cable.subscriptions.remove(subscriptionIdentifier)
        this.props.cableApp.cable.subscriptions.create({
                channel: 'AppearanceChannel',
                id: e,
                is_online: false,
            },
            {
                received: (data) => {
                    console.log(data)
                }
            })
    }

    updateAppStateRoom = (newRoom) => {
        this.setState({
            ...this.state,
            currentRoom: {
                chatroom: this.state.currentRoom.chatroom,
                users: this.state.currentRoom.users,
                messages: newRoom.messages
            }
        })
    }
      
    getRoomData = (id) => {
        // fetch(`${APP_URL}/api/chatrooms/${id}`, {
        fetch(`${APP_URL}/chatrooms/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("jwt_token")}`,
            }
        })
        .then(response => response.json())
        .then(result => {
            if(result.data){
                console.log("Complex Show")
                console.log(result.data)
                this.setState({
                    currentRoom: {
                        chatroom: result.data,
                        users: result.data.attributes.users,
                        messages: result.data.attributes.messages
                    }
                })
            } else {
                alert("Chatroom Not found!")
            }
        })
    }


    render() {
        return (
            <div>
                {/*<Header currentUser={this.state.currentUser}/>*/}
                <Header currentUser={this.state.currentUser} logout={this.handleLogout} />
                <Switch>
                    <Route exact path='/' render={(props) => {
                        return this.state.currentUser && isAuthenticated && this.state.currentRoom['room'] !== {} ? 
                            <ChatRooms {...props} currentRoom={this.state.currentRoom['chatroom']} updateCurrentUserRooms={this.updateCurrentUserRooms} currentUser={this.state.currentUser} /> :
                            <Login {...props} updateCurrentUser={this.updateCurrentUser} />
                    }} />
                    <Route exact path='/chatrooms/create' render={(props) => {
                        return this.state.currentUser && isAuthenticated ?
                            <CreateRoom {...props} currentUser={this.state.currentUser} updateRooms={this.updateRooms} currentRoom={this.state.currentRoom['chatroom']} /> :
                            <Login {...props} updateCurrentUser={this.updateCurrentUser} />
                    }} />
                    <Route exact path='/chatroom/:id' render={(props) => {
                        return (this.state.currentUser && this.getRoomData) ?
                                <ChatRoomShow
                                    {...props}
                                    cableApp={this.props.cableApp}
                                    currentUser={this.state.currentUser}
                                    getRoomData={this.getRoomData}
                                    roomData={this.state.currentRoom}
                                    updateApp={this.updateAppStateRoom}
                                /> : 
                                <Login {...props} updateCurrentUser={this.updateCurrentUser} />
                    }} />
                    <Route exact path='/auth/login' render={(props) => {
                        return this.state.currentUser && isAuthenticated ?
                        <Redirect to='/' /> :
                        <Login {...props} updateCurrentUser={this.updateCurrentUser} />
                    }} />
                    <Route path='/auth/register' render={(props) => {
                        return this.state.currentUser && isAuthenticated ?
                        <Redirect to='/' /> :
                        <Register {...props} updateCurrentUser={this.updateCurrentUser} />
                    }}/>
                </Switch>
            </div>
          
        );
    }
}


export default App;
