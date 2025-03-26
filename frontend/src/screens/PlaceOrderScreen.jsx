import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import CheckoutSteps from '../components/CheckoutSteps'
import { createOrder } from '../actions/orderActions'
import { ORDER_CREATE_RESET } from '../constants/orderConstants'

function PlaceOrderScreen() {
    const cart = useSelector(state => state.cart)
    const navigate = useNavigate()

    const orderCreate = useSelector(state => state.orderCreate)
    const { order, success, error } = orderCreate

    const dispatch = useDispatch()

    const itemsPrice = cart.cartItems?.reduce((acc, item) => acc + (Number(item.price) || 0), 0).toFixed(2);
    const taxPrice = (0.6 * itemsPrice).toFixed(2);
    const totalPrice = (Number(itemsPrice) + Number(taxPrice)).toFixed(2);

    useEffect(() => {
        if (success) {
            navigate(`/order/${order._id}`)
            dispatch({ type: ORDER_CREATE_RESET })
        }
        if (!cart.paymentMethod || cart.paymentMethod === '') {
            navigate('/payment')
        }
    }, [navigate, success, cart, order, dispatch])
    
    const placeOrder = () => {
        dispatch(createOrder({
            orderItems: cart.cartItems,
            paymentMethod: cart.paymentMethod,
            itemsPrice,
            taxPrice,
            totalPrice
        }));
    };
    
  return (
    <div>
      <CheckoutSteps step1 step2 step3 />
      <Row>
        <Col md={8}>
            <ListGroup variant='flush'>
                <ListGroup.Item>
                    <h2>Payment Method</h2>
                    <p>
                        <strong>Method: </strong>
                        {cart.paymentMethod}
                    </p>
                </ListGroup.Item>
                <ListGroup.Item>
                    <h2>Order House</h2>
                    {(cart.cartItems?.length === 0) ? (
                        <Message variant='info'>
                            Your cart is empty
                        </Message>
                    ) : (
                        <ListGroup variant='flush'>
                            {cart.cartItems?.map((item, index) => (
                                <ListGroup.Item>
                                    <Row>
                                        <Col md={1}>
                                            <Image src={item.image} alt={item.name} fluid rounded />
                                        </Col>
                                        <Col>
                                            <Link to={`/house/${item.house}`}>{item.name}</Link>
                                        </Col>
                                        <Col md={4}>
                                           ${item.price}
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </ListGroup.Item>
            </ListGroup>

        </Col>
        <Col md={4}>
            <Card>
                <ListGroup variant='flush'>
                    <ListGroup.Item>
                        <h2>Order Summary</h2>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Row>
                            <Col>Items</Col>
                            <Col>${itemsPrice}</Col>
                        </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Row>
                            <Col>Tax</Col>
                            <Col>${taxPrice}</Col>
                        </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Row>
                            <Col>Total</Col>
                            <Col>${totalPrice}</Col>
                        </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        {error && <Message variant='danger'>{error}</Message>}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Button
                            type='button'
                            className='btn-block'
                            disabled={cart.cartItems === 0}
                            onClick={placeOrder}
                        >
                            Place Order
                        </Button>
                    </ListGroup.Item>
                </ListGroup>
            </Card>
        </Col>
      </Row>
    </div>
  )
}

export default PlaceOrderScreen
