import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { AuthContext, PathContext } from '../hooks/Context';
import useFindUser from '../hooks/useFindUser';

// routes
import PrivateRoute from './PrivateRoute';
// import DatasetRoute from './DatasetRoute'; // no longer used
import RestrictedRoute from './RestrictedRoute';
import AdminRoute from './AdminRoute';

// navigation and footer
import NavigationRev from '../components/Navigation/NavigationRev';
import Footer from '../components/Footer/Footer';

// views
import MainRev from '../components/Main/MainRev';
import DatasetMain from '../components/Main/DatasetMain';
import SearchRequest from '../components/SearchRequest/SearchRequest';
import SingleDataset from '../components/SingleDataset/SingleDataset';
import SingleDatasetNew from '../components/SingleDataset/SingleDatasetNew';
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
import TclTable from '../components/Tcl/TclTable';
import DataTypes from '../components/Main/DataTypes';
import SetSearch from '../components/SearchRequest/All/SetSearch';
// import Test from '../components/Test/Test';

const Router = () => {
    const { user, setUser, loading } = useFindUser();
    const [datatype, setDatatype] = useState('');

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            <PathContext.Provider value={{ datatype, setDatatype }}>
                <NavigationRev />
                <Routes>
                    <Route path="/" element={<MainRev />} />
                    <Route path="/datatypes" element={<DataTypes />} />
                    <Route path="/:datatype" element={<DatasetMain />} />
                    <Route path="/:datatype/search" element={<SearchRequest />} />
                    <Route path="/:datatype/canonical" element={<CanonicalPSets />} />
                    <Route path="/:datatype/status" element={<RequestStatus />} />
                    <Route path="/:datatype/stats" element={<Stats />} />
                    <Route path="/app/documentation/:section" element={<Documentation />} />
                    <Route path="/app/contact" element={<Contact />} />
                    <Route path="/app/authentication" element={<Authentication />} />
                    <Route path="/user/reset/:token" element={<Reset />} />
                    <Route
                        path="/app/data_submission"
                        element={<PrivateRoute element={<DataSubmission />} redirect="/app/authentication" />}
                    />{' '}
                    <Route
                        path="/app/profile"
                        element={<PrivateRoute element={<Profile />} redirect="/app/authentication" />}
                    />
                    <Route path="/app/admin" element={<AdminRoute element={Admin} redirect="/app/profile" />} />
                    <Route path="/datatypes/:datatype" element={<SetSearch />} />
                    <Route
                        path="/app/data_submission/submitted/:id"
                        element={
                            <RestrictedRoute
                                element={SingleDataSubmission}
                                redirect="/app/authentication"
                                type="dataSubmission"
                            />
                        }
                    />
                    {/* The route below has been deprecated, however it is used if there are still
					out there that reference the old link type in ORCESTRA */}
                    <Route path="/:datatype/:id1/:id2" element={<SingleDataset />} />
                    <Route path="/:datatype/:id" element={<SingleDatasetNew />} />
                    <Route path="*" element={<NotFound404 />} />
                    <Route path="/tcl/table" element={<TclTable />} />
                </Routes>
            </PathContext.Provider>
        </AuthContext.Provider>
    );
};

export default Router;
