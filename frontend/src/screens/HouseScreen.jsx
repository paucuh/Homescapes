import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Col, Row, Image, ListGroup, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { listHouseDetails } from '../actions/houseActions';
import Rating from '../components/Rating';

function HouseScreen() {
    const { id } = useParams();
    const dispatch = useDispatch();

    const houseDetail = useSelector((state) => state.houseDetail);
    const { loading, error, house } = houseDetail; // assuming API returns a single house object

    useEffect(() => {
        dispatch(listHouseDetails(id));
    }, [dispatch, id]);

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
                        <Col md={6}>
                            <Image src={house.image} alt={house.name} fluid className="rounded shadow" />
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
                                    <strong>Price: </strong> <span className="text-success">${house.price}</span>
                                </ListGroup.Item>
                                {/* <ListGroup.Item>
                                    <strong>Status: </strong>
                                    {house.availability ? (
                                        <span className="text-success">Available</span>
                                    ) : (
                                        <span className="text-danger">Not Available</span>
                                    )}
                                </ListGroup.Item> */}
                            </ListGroup>
                        </Col>
                    </Row>
                </>
            )}
        </Container>
    );
}

export default HouseScreen;
