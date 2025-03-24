import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Nav, Navbar, Button } from 'react-bootstrap';
import { logout } from '../actions/userActions';
import SearchBox from '../components/SearchBox';  // Import the search box component

function Header() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

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
                        {userInfo && (
                            <Link to="/profile" className="nav-link">
                                <i className="fa-solid fa-user"></i> Account
                            </Link>
                        )}

                        {userInfo && (userInfo.role === 'Seller' || userInfo.role === 'admin') && (
                            <Link to="/create-listing" className="nav-link">
                                <i className="fa-solid fa-plus"></i> Create Listing
                            </Link>
                        )}

                        {/* ✅ New Messages Nav Link */}
                        {userInfo && (
                            <Link to="/messages" className="nav-link">
                                <i className="fa-solid fa-comments"></i> Messages
                            </Link>
                        )}
                    </Nav>

                    {/* Use the SearchBox component here */}
                    <SearchBox />

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
