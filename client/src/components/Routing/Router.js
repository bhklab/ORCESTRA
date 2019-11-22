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
            setAuthToken: (value) => {
                this.setState({authenticated: value});
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
                        <Route exact path ='/' component={App}/>
                        <Route exact path ='/PSetList' component={PSetList}/>
                        <Route exact path ='/PSetRequest' component={PSetRequest}/>
                        <Route exact path ='/Stats' component={Stats}/>
                        <Route exact path='/Authentication' component={Login} />
                        <PrivateRoute path='/Profile' component={profile} redirect='/Authentication' />
                    </Switch>
                </BrowserRouter>
            </AuthContext.Provider>
        );
    }
}

// function Router(){   
//     // const [authTokens, setAuthTokens] = useState();
//     // const setTokens = (data) => {
//     //     localStorage.setItem("tokens", JSON.stringify(data));
//     //     setAuthTokens(data);
//     // }
//     const authTokens = true;
//     return(
//         <AuthContext.Provider value={authTokens}>
//             <BrowserRouter>
//                 <Switch>
//                     <Route exact path ='/' component={App}/>
//                     <Route exact path ='/PSetList' component={PSetList}/>
//                     <Route exact path ='/PSetRequest' component={PSetRequest}/>
//                     <Route exact path ='/Stats' component={Stats}/>
//                     <Route exact path='/Authentication' component={Login} />
//                     <PrivateRoute path='/Profile' component={Profile} redirect='/Authentication' />
//                 </Switch>
//             </BrowserRouter>
//         </AuthContext.Provider>
//     );
// }

export default Router;