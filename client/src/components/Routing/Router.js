import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { AuthContext } from "../../context/auth";
import Navigation from '../Navigation/Navigation';
import Footer from '../Footer/Footer';
import PrivateRoute from './PrivateRoute';
import Main from '../Main/Main';
import PSetSearch from '../PSetSearch/PSetSearch';
import Dashboard from '../Dashboard/Dashboard';
import Stats from '../Stats/Stats';
import Documentation from '../Documentation/Documentation';
import Tutorial from '../Documentation/Support/Tutorial';
import Profile from '../Profile/Profile';
import Login from '../Authentication/Login';
import Reset from '../Authentication/Reset';
import PSet from '../PSet/PSet';
import NotFound404 from '../Shared/NotFound404';

class Router extends React.Component{
    constructor(){
        super();
        this.state = {
            authenticated: false,
            isAdmin: false,
            username: '',
            setAuthToken: (value) => {
                this.setState({
                    authenticated: value.authenticated,
                    username: value.username,
                    isAdmin: value.isAdmin
                });
            },
            resetAuthToken: () => {
                this.setState({
                    authenticated: false,
                    isAdmin: false,
                    user: ''
                });
            }
        }
    }

    componentDidMount(){
        if(!this.state.authenticated){
            fetch('/api/user/checkToken')
            .then(res => {
                if(res.status === 200){
                    return(res.json());
                }else{
                    return({authenticated: false, isAdmin: false, username: ''});
                }
            })
            .then(data => {
                this.state.setAuthToken(data)
            });
        }
    }

    render(){
        
        const profile = (
            <Profile />
        );

        return(
            <AuthContext.Provider value={this.state}>
                <Switch>
                    <Route exact path ='/' component={Main} /> 
                    <Route exact path ='/PSetSearch' component={PSetSearch}/>
                    <Route exact path ='/Dashboard' component={Dashboard}/>
                    <Route exact path ='/Stats' component={Stats}/>
                    <Route exact path ='/Documentation' component={Documentation}/>
                    <Route exact path ='/Tutorial' component={Tutorial}/>
                    <Route exact path='/Authentication' component={Login} />
                    <Route path ='/Reset/:token' component={Reset} />
                    <Route path='/:id1/:id2' component={PSet} />
                    <PrivateRoute path='/Profile' component={profile} redirect='/Authentication' />
                    <Route component={NotFound404}/>
                </Switch>
                <Navigation />
                <Footer />
            </AuthContext.Provider>
        );
    }
}

export default Router;