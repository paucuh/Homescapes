import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Col, Row, Image, ListGroup, Container, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { listHouseDetails } from '../actions/houseActions';
import { getUserProfile } from '../actions/userActions'; // To get user profile

function HouseScreen() {
    const { id } = useParams();
    const dispatch = useDispatch();

    // Get house details from Redux state
    const houseDetail = useSelector((state) => state.houseDetail);
    const { loading, error, house } = houseDetail;

    // Get user profile from Redux state
    const userProfile = useSelector((state) => state.userProfile);
    const { user } = userProfile;

    useEffect(() => {
        dispatch(listHouseDetails(id));  // Fetch house details
        dispatch(getUserProfile());  // Fetch logged-in user profile
    }, [dispatch, id]);

    // Check if the logged-in user is the creator of the house
    const isUserHouseCreator = user && house && user._id === house.lister;

    return (
        <Container className="my-4">
            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">{error}</Message>
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
                            </ListGroup>

                            {/* Show Edit button only if the user is the creator of the house */}
                            {isUserHouseCreator && (
                                <Link to={`/house/update/${house._id}`}>
                                    <Button variant="primary" className="mt-3">
                                        Edit House
                                    </Button>
                                </Link>
                            )}
                        </Col>
                    </Row>
                </>
            )}
        </Container>
    );
}

export default HouseScreen;
