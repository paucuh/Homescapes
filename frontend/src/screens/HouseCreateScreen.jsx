import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createHouse } from '../actions/houseActions';
import { Form, Button, Container, Alert, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const HouseCreateScreen = () => {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { userInfo } = useSelector(state => state.userLogin);
    const { success, error } = useSelector(state => state.houseCreate);

    // ✅ Restrict access to Sellers and Admins only
    useEffect(() => {
        if (!userInfo || (userInfo.role !== 'Seller' && userInfo.role !== 'admin')) {
            navigate('/');  // Redirect unauthorized users
        }
    }, [userInfo, navigate]);

    const submitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('address', address);
        formData.append('price', price);
        formData.append('description', description);
        if (image) formData.append('image', image);

        dispatch(createHouse(formData));
    };

    return (
        <Container className="my-5" style={{ maxWidth: '600px' }}>
            <Card className="p-4 shadow rounded">
                <h2 className="text-center mb-4">Create House Listing</h2>

                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">House created successfully!</Alert>}

                <Form onSubmit={submitHandler}>
                    <Form.Group className="mb-3" controlId="name">
                        <Form.Label>House Name</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="Enter house name" 
                            value={name} 
                            onChange={e => setName(e.target.value)} 
                            required 
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="address">
                        <Form.Label>Address</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="Enter address" 
                            value={address} 
                            onChange={e => setAddress(e.target.value)} 
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="price">
                        <Form.Label>Price</Form.Label>
                        <Form.Control 
                            type="number" 
                            placeholder="Enter price" 
                            value={price} 
                            onChange={e => setPrice(e.target.value)} 
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control 
                            as="textarea" 
                            rows={3} 
                            placeholder="Enter description" 
                            value={description} 
                            onChange={e => setDescription(e.target.value)} 
                        />
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="image">
                        <Form.Label>Upload Image</Form.Label>
                        <Form.Control 
                            type="file" 
                            onChange={e => setImage(e.target.files[0])} 
                        />
                    </Form.Group>

                    <Button type="submit" variant="primary" className="w-100">Create Listing</Button>
                </Form>
            </Card>
        </Container>
    );
};

export default HouseCreateScreen;
