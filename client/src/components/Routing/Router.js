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
import PSetSearch from '../PSetSearch/PSetSearch';
import Dashboard from '../Dashboard/Dashboard';
import Stats from '../Stats/Stats';
import Documentation from '../Documentation/Documentation';
import Profile from '../Profile/Profile';
import Admin from '../Admin/Admin';
import Login from '../Authentication/Login';
import Reset from '../Authentication/Reset';
import PSet from '../PSet/PSet';
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
                    <Route exact path ='/:datatype' component={DatasetMain} /> 
                    <Route exact path ='/:datatype/search' component={PSetSearch}/>
                    <Route exact path ='/:datatype/status' component={Dashboard}/>
                    <Route exact path ='/:datatype/stats' component={Stats}/>
                    <Route exact path ='/:datatype/documentation/:section' component={Documentation} />
                    <Route exact path='/app/authentication' component={Login} />
                    <Route path ='/reset/:token' component={Reset} />
                    <Route path='/:id1/:id2' component={PSet} />
                    <Route path='/:datatype/canonical' component={CanonicalPSets} />
                    <PrivateRoute path='/app/profile' component={Profile} redirect='/app/authentication' />
                    <AdminRoute path='/admin' component={Admin} redirect='/app/profile' />
                    <Route component={NotFound404}/>
                </Switch>
                <Footer />
            </PathContext.Provider>
        </AuthContext.Provider>
    );
}

// class Router extends React.Component{
//     constructor(){
//         super();
//         this.state = {
//             authenticated: false,
//             isAdmin: false,
//             username: '',
//             datatype: '',
//             setDatatype: (value) => {
//                 this.setState({
//                     ...this.state,
//                     datatype: value
//                 })
//             },
//             setAuthToken: (value) => {
//                 this.setState({
//                     authenticated: value.authenticated,
//                     username: value.username,
//                     isAdmin: value.isAdmin
//                 });
//             },
//             resetAuthToken: () => {
//                 this.setState({
//                     authenticated: false,
//                     isAdmin: false,
//                     user: ''
//                 });
//             }
//         }
//     }

//     componentDidMount(){
//         if(!this.state.authenticated){
//             fetch('/api/user/checkToken')
//             .then(res => {
//                 return(res.json());
//             })
//             .then(data => {this.state.setAuthToken(data)});
//         }
//     }

//     render(){
//         return(
//             <AuthContext.Provider value={this.state}>
//                 <Navigation />
//                 <Switch>
//                     <Route exact path ='/' component={Main} /> 
//                     <Route exact path ='/:datatype' component={DatasetMain} /> 
//                     <Route exact path ='/:datatype/search' component={PSetSearch}/>
//                     <Route exact path ='/:datatype/status' component={Dashboard}/>
//                     <Route exact path ='/:datatype/stats' component={Stats}/>
//                     <Route exact path ='/:datatye/documentation/:section' component={Documentation} />
//                     <Route exact path='/authentication' component={Login} />
//                     <Route path ='/reset/:token' component={Reset} />
//                     <Route path='/:id1/:id2' component={PSet} />
//                     <Route path='/:datatype/canonical' component={CanonicalPSets} />
//                     <PrivateRoute path='/profile' component={Profile} redirect='/authentication' />
//                     <AdminRoute path='/admin' component={Admin} redirect='/profile' />
//                     <Route component={NotFound404}/>
//                 </Switch>
//                 <Footer />
//             </AuthContext.Provider>
//         );
//     }
// }

export default Router;