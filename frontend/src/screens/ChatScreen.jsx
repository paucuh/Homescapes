import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Card, ListGroup } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import axios from 'axios';

const ChatScreen = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const chatSocket = useRef(null);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const { buyerId, sellerId } = useParams();
    const roomId = `${buyerId}_${sellerId}`;  // Always buyer first, seller second


    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
        }
    }, [userInfo, navigate]);

    useEffect(() => {
        if (!userInfo) return;

        const fetchChatMessages = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${userInfo.token}` }
                };
                const { data } = await axios.get(`https://homescapes-backend-feb38c088c8f.herokuapp.com/api/chat/${roomId}/`, config);
                const formattedMessages = data.map(msg =>
                    `${msg.sender.id === userInfo._id ? 'You' : msg.sender.username}: ${msg.content}`
                );
                setMessages(formattedMessages);
            } catch (error) {
                console.error('Error fetching chat history:', error);
            }
        };

        fetchChatMessages();
    }, [roomId, userInfo]);

    // ✅ WebSocket setup
    useEffect(() => {
        if (!userInfo) return;
   
        chatSocket.current = new WebSocket(`wss://homescapes-backend-feb38c088c8f.herokuapp.com/ws/chat/${roomId}/`);
   
        chatSocket.current.onopen = () => {
            console.log('WebSocket connected');
        };
   
        chatSocket.current.onmessage = (e) => {
            const data = JSON.parse(e.data);
            setMessages((prev) => [
                ...prev,
                `${data.sender_id === userInfo._id ? 'You' : data.sender_username}: ${data.message}`
            ]);
        };
   
        chatSocket.current.onclose = () => {
            console.log('WebSocket closed');
        };
   
        return () => {
            chatSocket.current?.close();
        };
    }, [roomId, userInfo]);
   

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessageHandler = (e) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;

        chatSocket.current.send(JSON.stringify({
            message: newMessage,
            sender_id: userInfo._id,
        }));

        setNewMessage('');
    };

    return (
        <Card className="container my-5 p-4 shadow-lg rounded">
            <h2 className="text-center mb-4">Chat Room</h2>

            <ListGroup variant="flush" className="mb-4" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {messages.map((msg, index) => (
                    <ListGroup.Item key={index}>{msg}</ListGroup.Item>
                ))}
                <div ref={messagesEndRef} />
            </ListGroup>

            <Form onSubmit={sendMessageHandler}>
                <Form.Group controlId="message">
                <Form.Control
                    type="text"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' ? sendMessageHandler(e) : null}
                />
                </Form.Group>
                <Button type="submit" className="mt-3 w-100">Send</Button>
            </Form>
        </Card>
    );
};

export default ChatScreen;
