import React, { Component } from 'react';

class ChatroomWebSocket extends Component {
    componentDidMount() {
        // console.log(this.props.match.params.id)
        // used getRoomData() to render data on ChatroomShow component
        this.props.getRoomData(window.location.href.match(/\d+$/)[0])
        // the to send params to the subscribed action in ChatroomsChannel

        this.props.cableApp.room = this.props.cableApp.cable.subscriptions.create({
            channel: 'ChatroomsChannel',
            room: window.location.href.match(/\d+$/)[0]
        },
        {
            received: (updatedRoom) => {
                this.props.updateApp(updatedRoom)
            }
        })
    }

    render() {
        return (
            <div></div>
        )
    }
}

export default ChatroomWebSocket