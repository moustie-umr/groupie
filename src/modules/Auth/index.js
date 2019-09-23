import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Login from './Login';
import Invite from './Invite';
import User from '../../providers/user';

const AuthComponent = ({ match }) => {
    if(User.isLoggedIn())
            this.onLoggedIn();
            
    return (
        <div>
            <Switch>
                <Route path={`${match.path}/invite/:id/:email`} component={Invite} />
                <Route component={Login} />
            </Switch>
        </div>
    )
}

export default AuthComponent;