import SockJsClient from 'react-stomp';
import {Container} from "react-bootstrap";

import "./LiveComponent.css";
import {useEffect, useState} from "react";

function LiveComponent() {

    let client = null;

    const [message, setMessage] = useState(null);
    const [messageQueue, setMessageQueue] = useState([]);

    useEffect(() => {
        if(messageQueue.length > 0 && message === null) {
            setMessage(messageQueue[0]);
            const [newMessage, ...newMessageQueue] = messageQueue;
            setMessageQueue(newMessageQueue);
        }
    }, [messageQueue, message])

    useEffect(() => {
        if (message != null) {
            const timer = setTimeout(function () {
                setMessage(null);
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
            {message && <h1>{message}</h1>}
        </Container>
    )
}

export default LiveComponent;