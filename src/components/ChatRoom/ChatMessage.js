import React from 'react';
import avatar from "./img/avatar.jpg";
import Avatar from "@material-ui/core/Avatar";

const ChatMessage = (props) => {

    const whichUser = () => {
        const my_message = props.currentUser.user_id
        const message = props.message.user_id
        let message_output = 'other-user-message'

        if (my_message === message) {
            message_output = 'current-user-message'
        }

        return message_output
    }

    return (
        <div id="chat-message" className={whichUser()}>
            <div style={{marginBottom: "15px"}}>
                <div style={{float: "left", marginRight: "15px"}}>
                    {/*<Avatar alt="user-avatar" src={`http://localhost:3000${props.user.attributes.avatar.url}`} />*/}
                </div>
                <div>
                    <span style={{paddingTop: "5px"}}>{props.user.attributes.complete_name}</span>
                </div>
            </div>
            <h4>{props.message.body}</h4>
        </div>     
    )
}

export default ChatMessage;
