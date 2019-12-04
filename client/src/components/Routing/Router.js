import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { AuthContext } from "../../context/auth";
import PrivateRoute from './PrivateRoute';
import App from '../App/App';
import PSetSearch from '../PSetSearch/PSetSearch';
import PSetRequest from '../PSetRequest/PSetRequest';
import Stats from '../Stats/Stats'
import Profile from '../Profile/Profile';
import Login from '../Authentication/Login';
import PSet from '../PSet/PSet';

class Router extends React.Component{
    constructor(){
        super();
        this.state = {
            authenticated: false,
            user: '',
            setAuthToken: (value) => {
                this.setState({
                    authenticated: value.authenticated,
                    username: value.username
                });
            },
            resetAuthToken: () => {
                this.setState({
                    authenticated: false,
                    user: ''
                });
            }
        }
    }

    componentDidMount(){
        if(!this.state.authenticated){
            fetch('/user/checkToken')
            .then(res => {
                if(res.status === 200){
                    return(res.json());
                }else{
                    return({authenticated: false, username: ''});
                }
            })
            .then(data => {this.state.setAuthToken(data)});
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
                        <Route exact path ='/PSetSearch' render={(props)=><PSetSearch path='/PSetSearch' {...props} />}/>
                        <Route exact path ='/PSetRequest' render={(props)=><PSetRequest path='/PSetRequest' {...props} />}/>
                        <Route exact path ='/Stats' render={(props)=><Stats path='/Stats' {...props} />}/>
                        <Route exact path='/Authentication' render={(props) => <Login {...props} />} />
                        <Route path='/PSet/:id' render={(props)=><PSet path='PSet/:id' {...props} />} />
                        <PrivateRoute path='/Profile' component={profile} redirect='/Authentication' />
                    </Switch>
                </BrowserRouter>
            </AuthContext.Provider>
        );
    }
}

export default Router;