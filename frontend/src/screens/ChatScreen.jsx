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

    const { roomId } = useParams();
    const [buyerId, sellerId] = roomId.split('_'); // Extract buyerId and sellerId
    console.log("Buyer ID:", buyerId, "Seller ID:", sellerId);

    // ✅ Redirect if not logged in
    useEffect(() => {
        if (!userInfo) navigate('/login');
    }, [userInfo, navigate]);

    // ✅ Fetch chat history
    useEffect(() => {
        if (!userInfo) return;

        const fetchChatMessages = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${userInfo.token}` }
                };
                const { data } = await axios.get(`https://homescapes-backend-feb38c088c8f.herokuapp.com/api/chat/${roomId}/`, config);
                setMessages(data.map(msg =>
                    `${msg.sender.id === userInfo._id ? 'You' : msg.sender.username}: ${msg.content}`
                ));
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    console.warn("No previous messages, starting fresh.");
                    setMessages([]);
                } else {
                    console.error('Error fetching chat history:', error);
                }
            }
        };

        fetchChatMessages();
    }, [roomId, userInfo]);

    // ✅ WebSocket setup with improved error handling
    useEffect(() => {
        if (!userInfo) return;

        chatSocket.current = new WebSocket(`wss://homescapes-backend-feb38c088c8f.herokuapp.com/ws/chat/${roomId}/`);

        chatSocket.current.onopen = () => {
            console.log("✅ WebSocket connected!");
        };

        chatSocket.current.onmessage = (e) => {
            const data = JSON.parse(e.data);
            console.log("📩 Message received:", data);

            setMessages((prev) => [
                ...prev,
                `${data.sender_id === userInfo._id ? 'You' : data.sender_username}: ${data.message}`
            ]);
        };

        chatSocket.current.onerror = (error) => {
            console.error("🚨 WebSocket Error:", error);
        };

        chatSocket.current.onclose = (event) => {
            console.warn(`⚠️ WebSocket closed (Code: ${event.code}, Reason: ${event.reason})`);
        };

        return () => {
            chatSocket.current?.close();
        };
    }, [roomId, userInfo]);

    // ✅ Scroll to latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // ✅ Send message function
    const sendMessageHandler = (e) => {
        e.preventDefault();
        if (newMessage.trim() === '' || !chatSocket.current) return;

        const messageData = {
            message: newMessage,
            sender_id: userInfo._id,
            sender_username: userInfo.username,
        };

        console.log("📤 Sending message:", messageData);

        chatSocket.current.send(JSON.stringify(messageData));
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
                    />
                </Form.Group>
                <Button type="submit" className="mt-3 w-100">Send</Button>
            </Form>
        </Card>
    );
};

export default ChatScreen;
