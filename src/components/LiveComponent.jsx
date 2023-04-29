import {Alert, Container} from "react-bootstrap";

import "./LiveComponent.css";
import {useEffect, useState} from "react";
import {CSSTransition} from "react-transition-group";
import {useSubscription} from "react-stomp-hooks";
import useSound from "use-sound";

import notification from '../assets/notification.mp3';

function LiveComponent() {
    const [message, setMessage] = useState(null);
    const [showMessage, setShowMessage] = useState(false);
    const [messageQueue, setMessageQueue] = useState([]);

    const [playSound] = useSound(notification);

    useEffect(() => {
        if(messageQueue.length > 0 && message === null) {
            const [newMessage, ...newMessageQueue] = messageQueue;
            setMessage(newMessage);
            setShowMessage(true);
            setMessageQueue(newMessageQueue);
            playSound();
        }
    }, [messageQueue, message])

    useEffect(() => {
        if (message != null) {
            const timer = setTimeout(function () {
                setShowMessage(false);
            }, 10000);

            return () => clearTimeout(timer);
        }
    }, [message]);

    useSubscription("/topic/racecontrol", (message) => {
        const newMessageQueue = [...messageQueue];
        newMessageQueue.push(message.body);
        setMessageQueue(newMessageQueue);
    })

    return (
        <Container fluid className="live">
            <CSSTransition in={showMessage} timeout={1500} unmountOnExit classNames={"fade"} onExited={() => setMessage(null)}>
                <Alert className="message">{message}</Alert>
            </CSSTransition>
        </Container>
    )
}

export default LiveComponent;