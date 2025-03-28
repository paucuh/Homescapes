import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../actions/userActions';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Alert, Card } from 'react-bootstrap';

const RegisterScreen = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('buyer');
    const [paypal_account_id, setPaypalAccountId] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const userRegister = useSelector(state => state.userRegister);
    const { loading, error, userInfo } = userRegister;

    useEffect(() => {
        if (userInfo) {
            if (userInfo.role === 'seller') {
                navigate('/create-listing');  // Redirect Sellers to the listing creation page
            } else {
                navigate('/');  // Buyers go to the homepage
            }
        }
    }, [userInfo, navigate]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(register(username, email, password, role, paypal_account_id));
    };

    return (
        <Container className="my-5" style={{ maxWidth: '500px' }}>
            <Card className="p-4 shadow rounded">
                <h2 className="text-center mb-4">Register</h2>

                {error && <Alert variant="danger">{error}</Alert>}
                {loading && <Alert variant="info">Loading...</Alert>}

                <Form onSubmit={submitHandler}>
                    <Form.Group className="mb-3">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Role</Form.Label>
                        <Form.Select value={role} onChange={(e) => setRole(e.target.value)}>
                            <option value="buyer">Buyer</option>
                            <option value="seller">Seller</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Paypal ID</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Paypal ID"
                            value={paypal_account_id}
                            onChange={(e) => setPaypalAccountId(e.target.value)}
                        />
                    </Form.Group>

                    <Button type="submit" variant="primary" className="w-100">Register</Button>
                </Form>
            </Card>
        </Container>
    );
};

export default RegisterScreen;
