import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Nav, Navbar, Button } from 'react-bootstrap';
import { logout } from '../actions/userActions';
import SearchBox from '../components/SearchBox';

function Header() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    // ✅ Local state to track user info and prevent unnecessary re-renders
    const [currentUser, setCurrentUser] = useState(userInfo);

    // ✅ Watch for userInfo changes
    useEffect(() => {
        setCurrentUser(userInfo);
    }, [userInfo]); // Runs only when userInfo changes

    const logoutHandler = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <Navbar expand="lg" bg="black" variant="dark">
            <Container>
                <Link to="/" className="navbar-brand fw-bold">HomeScapes</Link>
                <Navbar.Toggle aria-controls="navbar-nav" />
                <Navbar.Collapse id="navbar-nav">
                    <Nav className="me-auto">
                        {currentUser && (
                            <Link to="/profile" className="nav-link">
                                <i className="fa-solid fas fa-user"></i> Account
                            </Link>
                        )}

                        {currentUser && currentUser.role && (currentUser.role.toLowerCase() === 'seller' || currentUser.role.toLowerCase() === 'admin') && (
                            <Link to="/create-listing" className="nav-link">
                                <i className="fa-solid fas fa-plus"></i> Create Listing
                            </Link>
                        )}

                        {currentUser && (
                            <Link to="/messages" className="nav-link">
                                <i className="fa-solid fas fa-comments"></i> Messages
                            </Link>
                        )}
                    </Nav>

                    <SearchBox />

                    {currentUser ? (
                        <>
                            <span className="text-white me-3">Welcome, {currentUser.username}</span>
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
