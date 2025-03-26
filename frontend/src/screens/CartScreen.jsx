import React, { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, ListGroup, Image, Button, Card } from 'react-bootstrap';
import Message from '../components/Message';
import { addToCart, removeFromCart } from '../actions/cartActions';

function CartScreen() {
  const { cartItems } = useSelector(state => state.cart);
  const { id: houseId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (houseId) dispatch(addToCart(houseId));
  }, [houseId, dispatch]);

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => navigate('/payment');

  const itemsPrice = cartItems.reduce((acc, item) => acc + Number(item.price || 0), 0).toFixed(2);

  return (
    <Row className="mt-4">
      <Col md={8}>
        <h2 className="mb-4">Shopping Cart</h2>
        {cartItems.length === 0 ? (
          <Message>Your cart is empty</Message>
        ) : (
          <ListGroup variant="flush">
            {cartItems.map((item, index) => (
              <ListGroup.Item key={index}>
                <Row className="align-items-center">
                  <Col md={3}><Image src={item.image} alt={item.name} fluid rounded /></Col>
                  <Col md={4}><Link to={`/house/${item.house}`}>{item.name}</Link></Col>
                  <Col md={2}>${item.price}</Col>
                  <Col md={2}>
                    <Button type="button" variant="danger" onClick={() => removeFromCartHandler(item.house)}>
                      <i className="fas fa-trash"></i>
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={4}>
        <Card>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h4>Subtotal ({cartItems.length}) items</h4>
              <strong>${itemsPrice}</strong>
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                type="button"
                className="w-100"
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Proceed To Checkout
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
}

export default CartScreen;
