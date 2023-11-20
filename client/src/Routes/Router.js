import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { AuthContext, PathContext } from "../hooks/Context";
import useFindUser from '../hooks/useFindUser';

// routes 
import PrivateRoute from './PrivateRoute';
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
    const { user, setUser, loading } = useFindUser();
    const [datatype, setDatatype] = useState('');

    return(
        <AuthContext.Provider value={{user, setUser, loading}}>
            <PathContext.Provider value={{datatype: datatype, setDatatype: setDatatype}}>
                <Navigation />
                <Routes>
                    <Route path ='/' element={<Main />} /> 
                    <Route path ='/:datatype' element={<DatasetMain />} /> 
                    <Route path ='/:datatype/search' element={<SearchRequest />} />
                    <Route path='/:datatype/canonical' element={<CanonicalPSets />} /> 
                    <Route path ='/:datatype/status' element={<RequestStatus />} />
                    <Route path ='/:datatype/stats' element={<Stats />} />
                    <Route path ='/app/documentation/:section' element={<Documentation />} />
                    <Route path ='/app/contact' element={<Contact />} />
                    <Route path='/app/authentication' element={<Authentication />} />
                    <Route path ='/user/reset/:token' element={<Reset />} />
					<Route path ='/app/data_submission' element={<PrivateRoute><DataSubmission /></PrivateRoute>} />
					<Route path='/app/profile' element={<PrivateRoute><Profile /></PrivateRoute>} />
					<Route path='/app/admin' element={<AdminRoute><Admin /></AdminRoute>} />
					<Route 
						path ='/app/data_submission/submitted/:id' 
						element={
							<RestrictedRoute type='dataSubmission'>
								<SingleDataSubmission />
							</RestrictedRoute>
						}
					/>
					<Route 
						path='/:datatype/:id1/:id2' 
						element={
							<RestrictedRoute type='data-object' dataType='datatype'>
								<SingleDataset />
							</RestrictedRoute>
						}
					/>
                    {/* <Route path='/development/test' element={<Test />} /> */}
                    <Route path='*' element={<NotFound404 />} />
                </Routes>
                <Footer />
            </PathContext.Provider>
        </AuthContext.Provider>
    );
}

export default Router;
