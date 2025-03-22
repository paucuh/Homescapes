import React from 'react';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import '../components_css/House.css';

function House({ house }) {
  if (!house) return null;

  return (
    <Card className="house-card shadow-lg border-0">
      <Link to={`/house/${house._id}`} className="house-link">
        <div className="image-container">
          <Card.Img 
            variant="top" 
            src={house.image} 
            alt={house.name}
            className="house-image"
          />
        </div>
      </Link>

      <Card.Body className="p-3">
        <Link to={`/house/${house._id}`} className="text-decoration-none">
          <Card.Title className="house-title">{house.name || 'Unnamed House'}</Card.Title>
        </Link>

        <Card.Text className="house-price">
          ${house.price?.toLocaleString() || 'N/A'}
        </Card.Text>
        
        <Card.Text className="house-address">
          {house.address || 'N/A'}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default House;
