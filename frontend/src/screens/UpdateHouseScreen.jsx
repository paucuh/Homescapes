import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { updateHouse, listHouseDetails } from "../actions/houseActions";  
import Loader from "../components/Loader";
import Message from "../components/Message";
import { Form, Button, Card, InputGroup, Row, Col } from "react-bootstrap";
import { FaHome, FaMapMarkedAlt, FaDollarSign, FaInfoCircle } from "react-icons/fa";
import { useState } from "react";

const UpdateHouseScreen = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const houseUpdate = useSelector((state) => state.houseUpdate);
    const { loading: updateLoading, error: updateError, success } = houseUpdate;

    const houseDetail = useSelector((state) => state.houseDetail);
    const { house, loading: houseLoading, error: houseError } = houseDetail;

    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        // Ensure house data is fetched when the component mounts or when the ID changes
        dispatch(listHouseDetails(id));  
    }, [dispatch, id]);

    useEffect(() => {
        // Only initialize form state once when house details are fetched
        if (house && house._id === id) {
            setName(house.name);
            setAddress(house.address);
            setPrice(house.price);
            setDescription(house.description);
        }
    }, [house, id]);

    useEffect(() => {
        if (success) {
            navigate("/profile");  // Navigate to profile after successful update
        }
    }, [success, navigate]);

    const submitHandler = (e) => {
        e.preventDefault();
        if (name !== house.name || address !== house.address || price !== house.price || description !== house.description) {
            const houseData = { name, address, price, description };
            dispatch(updateHouse(id, houseData));  // Dispatch update action only if something changed
        }
    };

    return (
        <div className="container my-5">
            <Card className="shadow-lg rounded p-4">
                <h2 className="text-center mb-4">Update House</h2>
                {houseLoading ? (
                    <Loader />
                ) : houseError ? (
                    <Message variant="danger">{houseError}</Message>
                ) : (
                    <>
                        {updateLoading && <Loader />}
                        {updateError && <Message variant="danger">{updateError}</Message>}

                        <Row>
                            {/* Non-Editable House Details */}
                            <Col md={6}>
                                <Card className="p-3 mb-3">
                                    <h4>House Details</h4>
                                    <p><strong>House Name:</strong> {house.name}</p>
                                    <p><strong>Address:</strong> {house.address}</p>
                                    <p><strong>Price:</strong> ${house.price}</p>
                                    <p><strong>Description:</strong> {house.description}</p>
                                </Card>
                            </Col>

                            {/* Editable Form */}
                            <Col md={6}>
                                <Form onSubmit={submitHandler}>
                                    <h4>Edit House Details</h4>

                                    <Form.Group controlId="name" className="mb-3">
                                        <Form.Label>House Name</Form.Label>
                                        <InputGroup>
                                            <InputGroup.Text><FaHome /></InputGroup.Text>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter house name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="rounded-end"
                                            />
                                        </InputGroup>
                                    </Form.Group>

                                    <Form.Group controlId="address" className="mb-3">
                                        <Form.Label>Address</Form.Label>
                                        <InputGroup>
                                            <InputGroup.Text><FaMapMarkedAlt /></InputGroup.Text>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter address"
                                                value={address}
                                                onChange={(e) => setAddress(e.target.value)}
                                                className="rounded-end"
                                            />
                                        </InputGroup>
                                    </Form.Group>

                                    <Form.Group controlId="price" className="mb-3">
                                        <Form.Label>Price</Form.Label>
                                        <InputGroup>
                                            <InputGroup.Text><FaDollarSign /></InputGroup.Text>
                                            <Form.Control
                                                type="number"
                                                placeholder="Enter price"
                                                value={price}
                                                onChange={(e) => setPrice(e.target.value)}
                                                className="rounded-end"
                                            />
                                        </InputGroup>
                                    </Form.Group>

                                    <Form.Group controlId="description" className="mb-3">
                                        <Form.Label>Description</Form.Label>
                                        <InputGroup>
                                            <InputGroup.Text><FaInfoCircle /></InputGroup.Text>
                                            <Form.Control
                                                as="textarea"
                                                placeholder="Enter description"
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                className="rounded-end"
                                            />
                                        </InputGroup>
                                    </Form.Group>

                                    <Button type="submit" className="w-100 btn-primary rounded shadow-sm">
                                        Update Listing
                                    </Button>
                                </Form>
                            </Col>
                        </Row>
                    </>
                )}
            </Card>
        </div>
    );
};

export default UpdateHouseScreen;
