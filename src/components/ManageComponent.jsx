import {useHistory} from "react-router";
import {useEffect, useState} from "react";

import "./ManageComponent.css";
import {Button, Card, Form} from "react-bootstrap";
import {useAuth} from "react-oidc-context";

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
    const auth = useAuth();
    const history = useHistory();

    useEffect(() => {
        let timer = setTimeout(function() {
            if(!auth.isAuthenticated) history.push("/");
        }, 3000);

        return () => {clearTimeout(timer)}
    })

    useEffect(() => {
        if(!auth.isAuthenticated) {
            auth.signinRedirect();
        }
    }, [auth.isAuthenticated]);

    if(!auth.isAuthenticated) {
        return <h3>Redirecting to Login...</h3>
    }

    const authorized = auth.user.profile.resource_access["stream-backend"].roles.includes("manager");

    if(!authorized) {
        return <h3>You are not authorized to view this page.</h3>
    }

    return props.children;
}

function SubmitMessagePage() {
    const auth = useAuth();

    const [input, setInput] = useState("");

    const onInputChange = (event) => {
        setInput(event.target.value);
    };

    const onSubmitButton = () => {
        const headers = new Headers();
        headers.append("Content-Type", "text/plain");
        headers.set("Authorization", "Bearer " + auth.user.access_token);

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