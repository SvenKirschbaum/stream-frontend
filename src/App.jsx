import './App.css';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

import {Redirect} from "react-router";
import LiveComponent from "./components/LiveComponent";
import ManageComponent from "./components/ManageComponent";
import FrontpageComponent from "./components/FrontpageComponent";
import {StompSessionProvider} from "react-stomp-hooks";
import {useCallback} from "react";
import {AuthProvider} from "react-oidc-context";

function App() {

    const onSigninCallback = useCallback(() => {
        window.history.replaceState({}, document.title, window.location.pathname);
    }, []);

    return (
        <AuthProvider
            authority={import.meta.env.VITE_OIDC_AUTHORITY}
            client_id={import.meta.env.VITE_OIDC_CLIENT_ID}
            redirect_uri={window.location.origin.toString()}
            automaticSilentRenew={true}
            onSigninCallback={onSigninCallback}
        >
          <StompSessionProvider url={'/api/sock'}>
            <AppRouter/>
          </StompSessionProvider>
        </AuthProvider>
    );
}

function AppRouter() {
    return (
      <Router>
          <Switch>
            <Route path="/" exact component={FrontpageComponent}/>
            <Route path="/live" component={LiveComponent}/>
            <Route path="/manage" component={ManageComponent}/>
            <Route>
                <Redirect to={"/"} />
            </Route>
          </Switch>
      </Router>
    );
}

export default App;
