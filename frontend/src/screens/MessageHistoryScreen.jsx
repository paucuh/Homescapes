import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserChatRooms } from '../actions/chatActions';
import { ListGroup, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import Message from '../components/Message';

const MessageHistoryScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const chatList = useSelector((state) => state.chatList);
  const { loading, error, chats } = chatList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    dispatch(fetchUserChatRooms());  // ✅ Load conversations list
  }, [dispatch]);
  
  const handleChatClick = (chat) => {
    const buyerId = chat.buyer.id;
    const sellerId = chat.seller.id;
    const roomId = buyerId < sellerId ? `${buyerId}/${sellerId}` : `${sellerId}/${buyerId}`;
    navigate(`/chat/${roomId}`);
  };

  const getOtherUser = (chat) => {
    return userInfo._id === chat.buyer.id ? chat.seller : chat.buyer;
  };

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats]);

  return (
    <Container className="my-4">
      <h2 className="mb-4">Your Conversations</h2>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <ListGroup>
          {chats.length === 0 ? (
            <Message variant="info">No conversations found.</Message>
          ) : (
            chats.map((chat) => {
              const otherUser = getOtherUser(chat);
              return (
                <ListGroup.Item
                  key={chat.id}
                  action
                  onClick={() => handleChatClick(chat)}
                  className="d-flex justify-content-between align-items-center"
                >
                  <div>
                    <strong>{otherUser.username}</strong> ({otherUser.role})
                  </div>
                  <div className="text-muted">
                    {new Date(chat.created_at).toLocaleDateString()}
                  </div>
                </ListGroup.Item>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </ListGroup>
      )}
    </Container>
  );
};

export default MessageHistoryScreen;
