import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Container } from 'react-bootstrap';
import { searchHouses } from '../actions/houseActions';  // Import the searchHouses action
import House from '../components/House';
import Loader from '../components/Loader';
import Message from '../components/Message';

const SearchScreen = () => {
    const { keyword } = useParams();  // Capturing the keyword from the URL
    const dispatch = useDispatch();

    const houseList = useSelector(state => state.houseList);
    const { loading, error, houses } = houseList;

    useEffect(() => {
        dispatch(searchHouses(keyword));  // Dispatch action to search for houses by address
    }, [dispatch, keyword]);

    return (
        <Container className="my-4">
            <h2 className="mb-4">Search Results for "{keyword}"</h2>
            {loading ? <Loader /> : error ? <Message variant="danger">{error}</Message> : (
                <Row>
                    {houses.length === 0 && <Message>No houses found for this address.</Message>}
                    {houses.map(house => (
                        <Col key={house._id} sm={12} md={6} lg={4} xl={3}>
                            <House house={house} />
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
};

export default SearchScreen;
