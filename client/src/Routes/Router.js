import React, { useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import { AuthContext, PathContext } from "../hooks/Context";
import useFindUser from '../hooks/useFindUser';

// routes 
import PrivateRoute from './PrivateRoute';
import AdminRoute from './AdminRoute';

// navigation and footer
import Navigation from '../components/Navigation/Navigation';
import Footer from '../components/Footer/Footer';

// views
import Main from '../components/Main/Main';
import DatasetMain from '../components/Main/DatasetMain';
import SearchRequest from '../components/SearchRequest/SearchRequest';
import SingleDataset from '../components/SingleDataset/SingleDataset';
import RequestStatus from '../components/RequestStatus/RequestStatus';
import Stats from '../components/Stats/Stats';
import Documentation from '../components/Documentation/Documentation';
import Profile from '../components/Profile/Profile';
import Admin from '../components/Admin/Admin';
import Authentication from '../components/Authentication/Authentication';
import Reset from '../components/Authentication/Reset';
import CanonicalPSets from '../components/CanonicalPSets/CanonicalPSets';
import NotFound404 from '../components/Shared/NotFound404';

const Router = () => {
    /**
     * Loads user data to AuthContext.
     * Call find user hook as soon as the app is loaded, and routes are rendered. 
     * User is null if token is invalid, or not logged in.
     */
    const { user, setUser, loading } = useFindUser();
    const [datatype, setDatatype] = useState('');

    return(
        <AuthContext.Provider value={{user, setUser, loading}}>
            <PathContext.Provider value={{datatype: datatype, setDatatype: setDatatype}}>
                <Navigation />
                <Switch>
                    <Route exact path ='/' component={Main} /> 
                    <Route exact path ='/:datatype' render={(props) => (<DatasetMain {...props} />)} /> 
                    <Route exact path ='/:datatype/search' render={(props) => (<SearchRequest {...props}  />)}/>
                    <Route path='/:datatype/:id1/:id2' render={(props) => (<SingleDataset {...props} />)} />
                    <Route path='/:datatype/canonical' component={CanonicalPSets} /> 
                    <Route exact path ='/:datatype/status' component={RequestStatus}/>
                    <Route exact path ='/:datatype/stats' component={Stats}/>
                    <Route exact path ='/documentation/:section' component={Documentation} />
                    <Route exact path='/app/authentication' component={Authentication} />
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