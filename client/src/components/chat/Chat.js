import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../UserContext';
import { useParams, useNavigate} from 'react-router-dom';
import io from 'socket.io-client';
import Messages from './messages/Messages';
import Input from './input/Input';
import './Chat.css';

let socket;
const Chat = () => {

    const ENDPOINT = 'localhost:8000';

    const { user, setUser } = useContext(UserContext);
    let { room_id, room_name } = useParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [botMessage, setBotMessages] = useState('');
    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit('join', { name: user?.username, room_id, user_id: user?._id })
    }, [])
    useEffect(() => {
        socket.on('message', message => {
            setMessages([...messages, message])
        })
    }, [messages])
    useEffect(() => {
        socket.emit('get-messages-history', room_id)
        socket.on('output-messages', messages => {
            setMessages(messages)
        })
    }, [])
    const sendMessage = event => {
        event.preventDefault();
        if (message) {
            console.log(message)
            socket.emit('sendMessage', message, user?.username, user?._id, room_id,   () => setMessage(''))
        }
    }
    return (
        <div className="outerContainer">
            <div className="container">
                <Messages messages={messages} user_id={user?._id} />
                <Input
                    message={message}
                    setMessage={setMessage}
                    sendMessage={sendMessage}
                />
            </div>
        </div>
    )
}

export default Chat
