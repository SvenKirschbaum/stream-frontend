import './App.css';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {ReactKeycloakProvider} from "@react-keycloak/web";

import keycloak from "./keycloak";
import {Redirect} from "react-router";
import LiveComponent from "./components/LiveComponent";
import ManageComponent from "./components/ManageComponent";
import FrontpageComponent from "./components/FrontpageComponent";
import {StompSessionProvider} from "react-stomp-hooks";

function App() {
    return (
      <ReactKeycloakProvider authClient={keycloak} LoadingComponent={<div />} initOptions={{
        onLoad: 'check-sso',
        promiseType: 'native',
        flow: 'standard',
        pkceMethod: 'S256',
        checkLoginIframe: false,
        silentCheckSsoRedirectUri: window.location.origin + '/silent-sso.html',
        silentCheckSsoFallback: false
      }}>
          <StompSessionProvider url={'/api/sock'}>
            <AppRouter/>
          </StompSessionProvider>
      </ReactKeycloakProvider>
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
