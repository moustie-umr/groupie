import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Group from './Group';
import Groups from './Groups';
import Navbar from './components/Navbar';
import User from '../../providers/user';

const HomeComponent = ({ match }) => {
    return (
        <div>
            <Navbar onLogout={() => {
                User.logout();
                window.location.replace('');
            }}/>
            <Switch>
                <Route path={`${match.path}/:id`} component={Group} />
                <Route path={`${match.path}/`} component={Groups} />
                <Route component={Groups} />
            </Switch>
        </div>
    )
}

export default HomeComponent;