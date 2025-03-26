import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listUserHouses } from "../actions/houseActions";
import { getUserProfile, updateUserProfile } from "../actions/userActions";
import { getMyOrders } from "../actions/orderActions"; // <-- import the action
import Loader from "../components/Loader";
import Message from "../components/Message";
import { Link } from "react-router-dom";
import { Card, Row, Col, Container, Form, Button, ListGroup } from "react-bootstrap";
import "../screens_css/ProfileScreen.css";

function ProfileScreen() {
  const dispatch = useDispatch();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [successUpdate, setSuccessUpdate] = useState(false);

  const userProfile = useSelector((state) => state.userProfile);
  const { loading, error, user } = userProfile;

  const userHouses = useSelector((state) => state.userHouses);
  const { houses, loading: housesLoading, error: housesError } = userHouses;

  const orderListMy = useSelector((state) => state.orderListMy);
  const { orders, loading: ordersLoading, error: ordersError } = orderListMy;

  useEffect(() => {
    dispatch(getUserProfile());
    dispatch(listUserHouses());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
      setRole(user.role);
      if (user.role.toLowerCase() === "buyer") {
        dispatch(getMyOrders());
      }
    }
  }, [user, dispatch]);

  const handleUpdate = (e) => {
    e.preventDefault();
    const updatedUser = { username, email, role };
    dispatch(updateUserProfile(updatedUser));
    setSuccessUpdate(true);
  };

  useEffect(() => {
    console.log(orders);  // Check order object
  }, [orders]);
  

  return (
    <Container className="profile-container my-5">
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : user ? (
        <>
          {/* Profile Update Form */}
          <Card className="profile-card p-4 shadow-lg rounded mb-4">
            <h2 className="text-center mb-4 text-primary">Profile</h2>
            {successUpdate && <Message variant="success">Profile Updated Successfully!</Message>}
            <Form onSubmit={handleUpdate}>
              <Form.Group controlId="username" className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="email" className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="role" className="mb-3">
                <Form.Label>Role</Form.Label>
                <Form.Control
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  disabled
                />
              </Form.Group>

              <Button type="submit" className="btn btn-primary w-100">
                Update Profile
              </Button>
            </Form>
          </Card>

          {/* Render Listings if Seller */}
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
                              <Card.Text>{house.description}</Card.Text>
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

          {/* Render Orders if Buyer */}
          {user.role.toLowerCase() === "buyer" && (
            <>
              <h3 className="mt-4 text-primary">Your Orders</h3>
              {ordersLoading ? (
                <Loader />
              ) : ordersError ? (
                <Message variant="danger">{ordersError}</Message>
              ) : (
                <>
                  {orders.length > 0 ? (
                    <ListGroup>
                      {orders.map((order) => (
                        <ListGroup.Item key={order._id}>
                          <Row>
                            <Col>
                              <strong>Order ID:</strong> {order._id}
                            </Col>

                            <Col>
                              <strong>Total:</strong> ${order.totalPrice}
                            </Col>
                            <Col>
                            <strong>Status: </strong> 
                            {order.isPaid ? (
                              order.paidAt ? (
                                <>Paid on {order.paidAt.substring(0, 10)}</> // Format paidAt date
                              ) : (
                                <Message variant="danger">Payment Pending</Message> // In case isPaid is true but no paidAt
                              )
                            ) : (
                              <i className="fas fa-times" style={{ color: "red" }}></i> // If isPaid is false
                            )}
                            </Col>
                            <Col>
                              <Link to={`/order/${order._id}`} className="btn btn-sm btn-primary">
                                View Details
                              </Link>
                            </Col>
                          </Row>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  ) : (
                    <Message variant="info">You have no orders yet.</Message>
                  )}
                </>
              )}
            </>
          )}
        </>
      ) : (
        <Message variant="warning">No user data found</Message>
      )}
    </Container>
  );
}

export default ProfileScreen;
