import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile } from "../actions/userActions";
import Loader from "../components/Loader";
import Message from "../components/Message";

function ProfileScreen() {
  const dispatch = useDispatch();

  const userProfile = useSelector((state) => state.userProfile);
  const { loading, error, user } = userProfile;

  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  return (
    <div style={styles.container}>
      {loading ? (
        <Loader />
        ) : error ? (
        <Message variant="danger">{error}</Message>
        ) : user ? (
        <>
            <h2 style={styles.header}>Profile</h2>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
        </>
        ) : (
        <Message variant="warning">No user data found</Message>
    )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "500px",
    margin: "40px auto",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "12px",
    fontFamily: "Arial, sans-serif",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  header: {
    fontSize: "24px",
    marginBottom: "20px",
  },
};

export default ProfileScreen;
