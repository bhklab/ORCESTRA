import React, { useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import { AuthContext, PathContext } from "../hooks/Context";
import useFindUser from '../hooks/useFindUser';
import usePachyderm from '../hooks/usePachyderm';

// routes 
import PrivateRoute from './PrivateRoute';
// import DatasetRoute from './DatasetRoute'; not used
import RestrictedRoute from './RestrictedRoute';
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
import Contact from '../components/Contact/Contact';
import DataSubmission from '../components/DataSubmission/DataSubmission';
import SingleDataSubmission from '../components/DataSubmission/SingleDataSubmission';
import Profile from '../components/Profile/Profile';
import Admin from '../components/Admin/Admin';
import Authentication from '../components/Authentication/Authentication';
import Reset from '../components/Authentication/Reset';
import CanonicalPSets from '../components/CanonicalPSets/CanonicalPSets';
import NotFound404 from '../components/Shared/NotFound404';
// import Test from '../components/Test/Test';

const Router = () => {
    /**
     * Loads user data to AuthContext.
     * Call find user hook as soon as the app is loaded, and routes are rendered. 
     * User is null if token is invalid, or not logged in.
     */
    const { user, setUser, loading } = useFindUser();
    const [datatype, setDatatype] = useState('');
    const { online } = usePachyderm();

    return(
        <AuthContext.Provider value={{user, setUser, loading}}>
            <PathContext.Provider value={{datatype: datatype, setDatatype: setDatatype}}>
                <Navigation isPachydermOnline={online} />
                <Switch>
                    <Route exact path ='/' component={Main} /> 
                    <Route exact path ='/:datatype' render={(props) => (<DatasetMain {...props} />)} /> 
                    <Route exact path ='/:datatype/search' render={(props) => (<SearchRequest {...props}  />)}/>
                    <Route exact path='/:datatype/canonical' component={CanonicalPSets} /> 
                    <Route exact path ='/:datatype/status' component={RequestStatus}/>
                    <Route exact path ='/:datatype/stats' component={Stats}/>
                    <Route exact path ='/app/documentation/:section' component={Documentation} />
                    <Route exact path ='/app/contact' component={Contact} />
                    <Route exact path='/app/authentication' component={Authentication} />
                    <Route exact path ='/reset/:token' component={Reset} />
                    <PrivateRoute exact path ='/app/data_submission' component={DataSubmission} redirect='/app/authentication' />
                    <PrivateRoute exact path='/app/profile' component={Profile} redirect='/app/authentication' />
                    <AdminRoute exact path='/app/admin' component={Admin} redirect='/app/profile' />
                    <RestrictedRoute 
                        exact 
                        path ='/app/data_submission/submitted/:id' 
                        component={SingleDataSubmission} 
                        redirect='/app/authentication' 
                        type='dataSubmission'
                    />
                    <RestrictedRoute 
                        exact 
                        path='/:datatype/:id1/:id2' 
                        component={SingleDataset} 
                        redirect='/app/authentication' 
                        type='dataset'
                    />
                    {/* <Route exact path='/development/test' component={Test} /> */}
                    <Route component={NotFound404}/>
                </Switch>
                <Footer />
            </PathContext.Provider>
        </AuthContext.Provider>
    );
}

export default Router;