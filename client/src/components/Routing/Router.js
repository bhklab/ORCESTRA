import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { AuthContext } from "../../context/auth";
import PrivateRoute from './PrivateRoute';
import App from '../App/App';
import PSetList from '../PSetList/PSetList';
import PSetRequest from '../PSetRequest/PSetRequest';
import Stats from '../Stats/Stats'
import Profile from '../Profile/Profile';
import Login from '../Authentication/Login';

class Router extends React.Component{
    constructor(){
        super();
        this.state = {
            authenticated: false,
            user: '',
            // authenticated: true,
            // user: 'user1@email.com',
            setAuthToken: (value) => {
                this.setState({
                    authenticated: value.authenticated,
                    user: value.user
                });
            }
        }
    }

    render(){
        
        const profile = (
            <Profile />
        );

        return(
            <AuthContext.Provider value={this.state}>
                <BrowserRouter>
                    <Switch>
                        <Route exact path ='/' render={(props)=><App path='/' {...props} />} /> 
                        <Route exact path ='/PSetList' render={(props)=><PSetList path='/PSetList' {...props} />}/>
                        <Route exact path ='/PSetRequest' render={(props)=><PSetRequest path='/PSetRequest' {...props} />}/>
                        <Route exact path ='/Stats' render={(props)=><Stats path='/Stats' {...props} />}/>
                        <Route exact path='/Authentication' render={(props) => <Login {...props} />} />
                        <PrivateRoute path='/Profile' component={profile} redirect='/Authentication' />
                    </Switch>
                </BrowserRouter>
            </AuthContext.Provider>
        );
    }
}

export default Router;