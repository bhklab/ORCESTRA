import React, {useState, useEffect} from 'react';
import { Route, Switch } from 'react-router-dom';
import { AuthContext } from "../../context/auth";
import { PathContext } from "../../context/path";
import Navigation from '../Navigation/Navigation';
import Footer from '../Footer/Footer';
import PrivateRoute from './PrivateRoute';
import AdminRoute from './AdminRoute';
import Main from '../Main/Main';
import DatasetMain from '../Main/DatasetMain';
import SearchRequest from '../SearchRequest/SearchRequest';
import SingleDataset from '../SingleDataset/SingleDataset';
import Dashboard from '../Dashboard/Dashboard';
import Stats from '../Stats/Stats';
import Documentation from '../Documentation/Documentation';
import Profile from '../Profile/Profile';
import Admin from '../Admin/Admin';
import Login from '../Authentication/Login';
import Reset from '../Authentication/Reset';
import CanonicalPSets from '../CanonicalPSets/CanonicalPSets';
import NotFound404 from '../Shared/NotFound404';

const Router = () => {
    const [authToken, setAuthToken] = useState({
        authenticated: false,
        isAdmin: false,
        username: ''
    });

    const [datatype, setDatatype] = useState('');

    const resetAuthToken = () => {
        setAuthToken({
            authenticated: false,
            isAdmin: false,
            user: ''
        });
    }

    useEffect(() => {
        if(!authToken.authenticated){
            fetch('/api/user/checkToken')
            .then(res => {
                return(res.json());
            })
            .then(data => {setAuthToken(data)});
        }
    }, []);

    return(
        <AuthContext.Provider value={{...authToken, setAuthToken: setAuthToken, resetAuthToken: resetAuthToken}}>
            <PathContext.Provider value={{datatype: datatype, setDatatype: setDatatype}}>
                <Navigation />
                <Switch>
                    <Route exact path ='/' component={Main} /> 
                    <Route exact path ='/:datatype' render={(props) => (<DatasetMain {...props} />)} /> 
                    <Route exact path ='/:datatype/search' render={(props) => (<SearchRequest {...props}  />)}/>
                    <Route path='/:datatype/:id1/:id2' render={(props) => (<SingleDataset {...props} />)} />
                    <Route path='/:datatype/canonical' component={CanonicalPSets} /> 
                    <Route exact path ='/:datatype/status' component={Dashboard}/>
                    <Route exact path ='/:datatype/stats' component={Stats}/>
                    <Route exact path ='/:datatype/documentation/:section' component={Documentation} />
                    <Route exact path='/app/authentication' component={Login} />
                    <Route path ='/reset/:token' component={Reset} />
                    <PrivateRoute path='/app/profile' component={Profile} redirect='/app/authentication' />
                    <AdminRoute path='/admin' component={Admin} redirect='/app/profile' />
                    <Route component={NotFound404}/>
                </Switch>
                <Footer />
            </PathContext.Provider>
        </AuthContext.Provider>
    );
}

export default Router;