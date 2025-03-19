import React, { useEffect } from 'react';
import { Col, Row, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { listHouses } from '../actions/houseActions';
import House from '../components/House';

function HomeScreen() {
    const dispatch = useDispatch();
    const houselist = useSelector((state) => state.houseList);
    const { loading, error, houses } = houselist;

    useEffect(() => {
        dispatch(listHouses());
    }, [dispatch] );
    
  return (
    <Container className="my-4">
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Row>
            {houses.map((house) => (
              <Col key={house.id} sm={12} md={6} lg={4} xl={3}>
                <House house={house} />
              </Col>
            ))}
          </Row>
          <div className="mt-4">
            <Link to="/users" className="btn btn-primary">
              View Users
            </Link>
          </div>
        </>
      )}
    </Container>
  );
}

export default HomeScreen;
