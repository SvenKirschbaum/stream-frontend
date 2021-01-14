import {useKeycloak} from "@react-keycloak/web";
import {useHistory} from "react-router";
import {useEffect, useState} from "react";

import "./ManageComponent.css";
import {Button, Card, Form} from "react-bootstrap";

function ManageComponent() {
    return (
        <div className="manage">
            <AuthorizationCheck>
                <SubmitMessagePage />
            </AuthorizationCheck>
        </div>
    );
}

function AuthorizationCheck(props) {
    const {initialized, keycloak} = useKeycloak();
    const history = useHistory();

    useEffect(() => {
        let timer = setTimeout(function() {
            if(!authorized) history.push("/");
        }, 3000);

        return () => {clearTimeout(timer)}
    })

    if(!keycloak.authenticated) {
        keycloak.login();
        return null;
    }

    const authorized = keycloak.hasResourceRole("manager","stream-backend");

    if(!authorized) {
        return <h3>You are not authorized to view this page.</h3>
    }

    return props.children;
}

function SubmitMessagePage() {
    const {initialized, keycloak} = useKeycloak();

    const [input, setInput] = useState("");

    const onInputChange = (event) => {
        setInput(event.target.value);
    };

    const onSubmitButton = () => {
        const headers = new Headers();
        headers.append("Content-Type", "text/plain");
        headers.set("Authorization", "Bearer " + keycloak.token);

        fetch('/api/send', {
            method: 'POST',
            body: input,
            headers: headers
        }).then(value => {
            setInput("");
        }).catch(reason => {
            alert(reason);
        });
    };

    return (
        <Card className="manage-form" bg="secondary" text="light">
            <Card.Header>
                Nachricht senden
            </Card.Header>
            <Card.Body>
                <Form>
                    <Form.Group controlId="message">
                        <Form.Control as="textarea" placeholder="Nachricht eingeben" rows={8} value={input} onChange={onInputChange}/>
                    </Form.Group>
                    <Button variant="dark" type="button" className="float-right" onClick={onSubmitButton}>
                        Senden
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
}

export default ManageComponent;