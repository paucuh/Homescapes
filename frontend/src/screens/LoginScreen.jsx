import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col, Card, InputGroup } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { login } from '../actions/userActions'
import FormContainer from '../components/FormContainer'
import { FaEnvelope, FaLock } from 'react-icons/fa'

function LoginScreen() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const userLogin = useSelector(state => state.userLogin)
    const { error, loading, userInfo } = userLogin

    useEffect(() => {
        if (userInfo) {
            // ✅ Role-based redirect
            if (userInfo.role === 'Seller') {
                navigate('/create-listing')
            } else {
                navigate('/')
            }
        }
    }, [navigate, userInfo])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(login(email, password))
    }

    return (
        <FormContainer>
            <Card className="p-4 shadow-lg rounded">
                <h2 className="text-center mb-4">Sign In</h2>
                {error && <Message variant="danger">{error}</Message>}
                {loading && <Loader />}

                <Form onSubmit={submitHandler}>
                    <Form.Group controlId="email" className="mb-3">
                        <Form.Label>Email Address</Form.Label>
                        <InputGroup>
                            <InputGroup.Text><FaEnvelope /></InputGroup.Text>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="rounded-end"
                            />
                        </InputGroup>
                    </Form.Group>

                    <Form.Group controlId="password" className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <InputGroup>
                            <InputGroup.Text><FaLock /></InputGroup.Text>
                            <Form.Control
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="rounded-end"
                            />
                        </InputGroup>
                    </Form.Group>

                    <Button type="submit" className="w-100 btn-primary rounded shadow-sm">
                        Sign In
                    </Button>
                </Form>

                <Row className="py-3 text-center">
                    <Col>
                        New Customer?{' '}
                        <Link to="/register" className="text-primary">
                            Register Here
                        </Link>
                    </Col>
                </Row>
            </Card>
        </FormContainer>
    )
}

export default LoginScreen
