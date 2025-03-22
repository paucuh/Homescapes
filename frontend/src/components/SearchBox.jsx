import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, FormControl, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { searchHouses } from '../actions/houseActions';  // Import the search action

const SearchBox = () => {
    const [keyword, setKeyword] = useState('');
    const dispatch = useDispatch();  // Initialize dispatch
    const navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            dispatch(searchHouses(keyword));  // Dispatch the search action with the keyword
            navigate(`/search/${keyword}`);  // Redirect to the search page
        } else {
            navigate('/');  // Redirect to home if no keyword
        }
    };

    return (
        <Form onSubmit={submitHandler} className="d-flex me-3">
            <FormControl
                type="search"
                placeholder="Search by location..."
                className="me-2"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
            />
            <Button variant="outline-light" type="submit">Search</Button>
        </Form>
    );
};

export default SearchBox;
