import SockJsClient from 'react-stomp';
import {Alert, Container} from "react-bootstrap";

import "./LiveComponent.css";
import {useEffect, useState} from "react";
import {CSSTransition} from "react-transition-group";

function LiveComponent() {

    let client = null;

    const [message, setMessage] = useState(null);
    const [showMessage, setShowMessage] = useState(false);
    const [messageQueue, setMessageQueue] = useState([]);

    useEffect(() => {
        if(messageQueue.length > 0 && message === null) {
            setMessage(messageQueue[0]);
            setShowMessage(true);
            const [newMessage, ...newMessageQueue] = messageQueue;
            setMessageQueue(newMessageQueue);
        }
    }, [messageQueue, message])

    useEffect(() => {
        if (message != null) {
            const timer = setTimeout(function () {
                setShowMessage(false);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [message]);

    const onMessage = (message) => {
        const newMessageQueue = [...messageQueue];
        newMessageQueue.push(message);
        setMessageQueue(newMessageQueue);
    };

    return (
        <Container fluid className="live">
            <SockJsClient
                url={`/api/sock`}
                topics={['/topic/racecontrol']}
                onMessage={onMessage}
                ref={(_client) => client = _client}
            />
            <CSSTransition in={showMessage} timeout={1500} unmountOnExit classNames={"fade"} onExited={() => setMessage(null)}>
                <Alert variant="secondary" className="message">{message}</Alert>
            </CSSTransition>
        </Container>
    )
}

export default LiveComponent;