import React, { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Col, Row, Image, ListGroup, Container, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { listHouseDetails } from '../actions/houseActions';
import { getUserProfile } from '../actions/userActions'; // To get user profile

function HouseScreen() {
    const navigate = useNavigate();
    const { id } = useParams();
    const dispatch = useDispatch();

    const houseDetail = useSelector((state) => state.houseDetail);
    const { loading, error, house } = houseDetail;

    const userProfile = useSelector((state) => state.userProfile);
    const { user } = userProfile;

    const addToOrderHandler = () => {
        navigate(`/cart/${id}`);
    }

    useEffect(() => {
        dispatch(listHouseDetails(id));
        dispatch(getUserProfile());
    }, [dispatch, id]);

    return (
        <Container className="my-4">
            {(loading || !user || !house) ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">{error.message}</Message>
            ) : (
                <>
                    <Link to="/" className="btn btn-dark my-3">
                        &larr; Go Back
                    </Link>

                    <Row className="justify-content-center">
                        <Col md={6} className="d-flex align-items-center justify-content-center">
                            <div 
                                style={{
                                    width: '100%',
                                    maxHeight: '500px',
                                    overflow: 'hidden',
                                    borderRadius: '10px',
                                }}
                            >
                                <Image 
                                    src={house.image} 
                                    alt={house.name} 
                                    fluid 
                                    className="shadow"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>
                        </Col>

                        <Col md={4}>
                            <ListGroup variant="flush" className="shadow-sm p-3 rounded">
                                <ListGroup.Item>
                                    <h3 className="fw-bold">{house.name}</h3>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <p className="text-muted">{house.description}</p>
                                </ListGroup.Item>
                                <ListGroup.Item className="fs-5">
                                    <strong>Price: </strong> 
                                    <span className="text-success">${house.price}</span>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <strong>Location: </strong>
                                    <span className="text-info">{house.address}</span>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <strong>Availability: </strong>
                                    <span className={house.available ? 'text-success' : 'text-danger'}>
                                        {house.available ? 'Available' : 'Not Available'}
                                    </span>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <strong>Seller: </strong> <span className="text-info">{house.lister}</span>
                                </ListGroup.Item>
                            </ListGroup>
                            <div className="d-flex gap-2">
                                {house.available === true && user && house && user._id !== house.lister && house.lister && user.role?.toLowerCase() !== 'seller' && (
                                        <Button variant="primary" className="mt-3" onClick={addToOrderHandler}>
                                            Buy Now
                                        </Button>
                                )}

                                {user && house && user._id !== house.lister && house.lister && user.role?.toLowerCase() !== 'seller' && (
                                    <Link to={`/chat/${user._id}_${house.lister_id}`}>
                                        <Button variant="success" className="mt-3">
                                            Chat with Seller
                                        </Button>
                                    </Link>
                                )}

                            {user && house && user._id === house.lister && (
                                <Link to={`/house/update/${house._id}`}>
                                    <Button variant="primary" className="mt-3">
                                        Edit House
                                    </Button>
                                </Link>
                            )}
                            </div>
                        </Col>
                    </Row>
                </>
            )}
        </Container>
    );
}

export default HouseScreen;
