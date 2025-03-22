import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listUserHouses } from "../actions/houseActions";  // Import action for fetching user houses
import { getUserProfile } from "../actions/userActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { Link } from "react-router-dom";  // Import Link from react-router-dom
import { Card, Row, Col, Container } from "react-bootstrap";  // Import bootstrap components
import "../screens_css/ProfileScreen.css";

function ProfileScreen() {
  const dispatch = useDispatch();

  const userProfile = useSelector((state) => state.userProfile);
  const { loading, error, user } = userProfile;

  const userHouses = useSelector((state) => state.userHouses);
  const { houses, loading: housesLoading, error: housesError } = userHouses;

  useEffect(() => {
    dispatch(getUserProfile());
    dispatch(listUserHouses());  // Fetch the user's houses on component mount
  }, [dispatch]);

  return (
    <Container className="profile-container my-5">
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : user ? (
        <>
          {/* Profile Card */}
          <Card className="profile-card p-4 shadow-lg rounded mb-4">
            <h2 className="text-center mb-4 text-primary">Profile</h2>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
          </Card>

          {/* Only render Listings if user is a seller */}
          {user.role.toLowerCase() === "seller" && (
            <>
              <h3 className="mt-4 text-primary">Your Listings</h3>
              {housesLoading ? (
                <Loader />
              ) : housesError ? (
                <Message variant="danger">{housesError}</Message>
              ) : (
                <>
                  {houses.length > 0 ? (
                    <Row className="g-4">
                      {houses.map((house) => (
                        <Col key={house._id} md={4} className="mb-4">
                          <Card className="house-card shadow-sm rounded-lg">
                            <Card.Img
                              variant="top"
                              src={house.image}
                              alt={house.name}
                              className="house-image"
                            />
                            <Card.Body>
                              <Card.Title>{house.name}</Card.Title>
                              <Card.Text>{house.address}</Card.Text>
                              <Card.Text>${house.price}</Card.Text>
                              <Link to={`/house/update/${house._id}`} className="btn btn-primary w-100">
                                Edit Listing
                              </Link>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  ) : (
                    <Message variant="info">You have no houses listed yet.</Message>
                  )}
                </>
              )}
            </>
          )}
          
          {/* If the user is not a seller, skip rendering the listings */}
          {user.role.toLowerCase() !== "seller" && (
            <Message variant="info">You cannot view listings as you're not a seller.</Message>
          )}
          
        </>
      ) : (
        <Message variant="warning">No user data found</Message>
      )}
    </Container>
  );
}

export default ProfileScreen;
