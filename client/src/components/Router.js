import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import App from './App/App';
import PSetList from './PSetList/PSetList';
import PSetRequest from './PSetRequest/PSetRequest';
import Stats from './Stats/Stats'
import Profile from './Profile/Profile';

const Router = () => (
    <BrowserRouter>
        <Switch>
            <Route exact path ='/' component={App}/>
            <Route exact path ='/PSetList' component={PSetList}/>
            <Route exact path ='/PSetRequest' component={PSetRequest}/>
            <Route exact path ='/Stats' component={Stats}/>
            <Route exact path ='/Profile' component={Profile}/>
        </Switch>
    </BrowserRouter>
)

export default Router;