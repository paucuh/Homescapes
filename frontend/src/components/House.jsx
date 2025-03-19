import Card from 'react-bootstrap/Card';
import Rating from './Rating';
import { Link } from 'react-router-dom';

function House({ house }) {
  if (!house) return null;

  return (
    <Card className="house-card text-center shadow-sm border-0">
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

      <Card.Body className="d-flex flex-column p-2">
        <Link to={`/house/${house._id}`} className="text-decoration-none">
          <Card.Title className="house-title">{house.name || 'Unnamed House'}</Card.Title>
        </Link>

        <Card.Text as="h3" className="house-price">
          ${house.price?.toLocaleString() || 'N/A'}
        </Card.Text>

      </Card.Body>
    </Card>
  );
}

export default House;
