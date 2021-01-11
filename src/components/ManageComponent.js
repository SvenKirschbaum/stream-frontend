import PlaceholderComponent from "./PlaceholderComponent";
import {useKeycloak} from "@react-keycloak/web";
import {Redirect, useHistory} from "react-router";
import {useEffect} from "react";

function ManageComponent() {
    const {initialized, keycloak} = useKeycloak();
    let history = useHistory();

    const authorized = keycloak.hasResourceRole("manager","stream-backend");

    useEffect(() => {
        let timer = setTimeout(function() {
            if(!authorized) history.push("/");
        }, 3000);

        return () => {clearTimeout(timer)}
    })

    if(!keycloak.authenticated) keycloak.login();

    if(!authorized) {
        return <h3>You are not authorized to view this page.</h3>
    }

    return <PlaceholderComponent />
}

export default ManageComponent;