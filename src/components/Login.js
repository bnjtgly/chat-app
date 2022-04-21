import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import { APP_URL } from '../constants';
import { APP_CABLE_URL } from '../constants';
import actionCable from 'actioncable';

const styles = (theme) => ({
    root: {
        '& > *': {
        margin: theme.spacing(1),
        width: '25ch',
        },
    },
});

const CableApp = {};

class Login extends React.Component {

    constructor(props) {
        super(props)
        this.state = { 
            username: '',
            password: '',
        }
    }

    handleSubmit = (e) => {
        e.preventDefault()

        // fetch(`${APP_URL}/api/v1/login`, {
        fetch(`${APP_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({user: {
                email: this.state.username,
                password: this.state.password
            }})    
        })
        .then(response => response.json())
        .then(result => {
            // if (result.authenticated) {
            if (result.access_token) {
                // localStorage.setItem('jwt_token', result.token)
                localStorage.setItem('jwt_token', result.access_token)

                fetch(`${APP_URL}/api/users`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${result.access_token}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                })
                    .then(response => response.json())
                    .then(res => {
                        sessionStorage.setItem("user_id", `${res.user.user_id}`)
                        this.props.updateCurrentUser(res.user)
                        // this.subscribeApperance(res.user.user_id)
                    });


            } else {
                alert('Password/Username combination not found')
            }   
        })
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    subscribeApperance = (e) => {
        CableApp.cable = actionCable.createConsumer(`${APP_CABLE_URL}?user_id=${e}`);
        CableApp.cable.subscriptions.create({
                channel: 'AppearanceChannel',
                id: e,
                is_online: true,
            },
            {
                received: (data) => {
                    console.log(data)
                }
            })
    }
    
    render() { 
        return ( 
            <div className="form-items">
                <h1>Login</h1>
                <form noValidate autoComplete="off" onSubmit={(e) => this.handleSubmit(e)} >
                    <h3>UserName</h3>
                    <TextField 
                        label="Enter User Name" 
                        variant="outlined" 
                        name="username"
                        value={this.state.username}
                        onChange={(e) => this.handleChange(e)}  
                    />
                    <h3>Password</h3>
                    <TextField 
                        label="Enter Password" 
                        variant="outlined" 
                        type="password"
                        name="password"
                        value={this.state.password}
                        onChange={(e) => this.handleChange(e)}
                    /><br /><br />
                    <Button variant="contained" color="primary" type="Submit">
                        Submit
                    </Button>
                </form>
            </div>
        );
    }
}

export default withStyles(styles)(Login);