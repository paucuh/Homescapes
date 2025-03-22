import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Nav, Navbar, Form, FormControl, Button } from 'react-bootstrap';
import { logout } from '../actions/userActions';

function Header() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;
    console.log(userInfo);  // Check if userInfo has username



    const logoutHandler = () => {
        dispatch(logout());
        navigate('/login'); // Redirect to login page after logout
    };

    return (
        <Navbar expand="lg" bg="black" variant="dark">
            <Container>
                <Link to="/" className="navbar-brand fw-bold">HomeScapes</Link>
                <Navbar.Toggle aria-controls="navbar-nav" />
                <Navbar.Collapse id="navbar-nav">
                    <Nav className="me-auto">
                        {userInfo && (
                            <Link to="/profile" className="nav-link">
                                <i className="fa-solid fa-user"></i> Account
                            </Link>
                        )}
                    </Nav>

                    <Form className="d-flex me-3">
                        <FormControl
                            type="search"
                            placeholder="Search Listings..."
                            className="me-2"
                            aria-label="Search"
                        />
                        <Button variant="outline-light">Search</Button>
                    </Form>
                    {/* ✅ Display Login or Logout */}
                    {userInfo ? (
                        <>
                            <span className="text-white me-3">Welcome, {userInfo.username}</span>
                            <Button variant="outline-light" onClick={logoutHandler}>Logout</Button>
                        </>
                    ) : (
                        <Link to="/login" className="btn btn-outline-light">
                            Login
                        </Link>
                    )}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;