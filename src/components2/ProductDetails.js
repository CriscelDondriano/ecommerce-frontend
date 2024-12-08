import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Container, Card, Spinner, Button } from 'react-bootstrap';

const ProductDetails = () => {
  const { id } = useParams(); // Get product ID from the URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the product details by ID
    axios.get(`http://localhost:8000/api/products/${id}`)
      .then((response) => {
        setProduct(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching product details:', error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (!product) {
    return <p>Product not found.</p>;
  }

  return (
    <Container className="d-flex justify-content-center align-items-center mt-4">
      <Card style={{ width: '24rem', textAlign: 'center' }} className="p-3">
        <Card.Body>
          <Card.Title className="mb-3">{product.name}</Card.Title>
          <Card.Text>
            <strong>Description:</strong> {product.description}
          </Card.Text>
          <Card.Text>
            <strong>Available:</strong> {product.quantity} pieces
          </Card.Text>
          <Card.Text>
            <strong>Category:</strong> {product.category}
          </Card.Text>
          <Card.Text>
            <strong>Price: ₱{product.price}</strong>
          </Card.Text>
        </Card.Body>
        <Link to="/store">
          <Button variant="dark" className="mt-3 w-100">Back</Button>
        </Link>
      </Card>
    </Container>

  );
};

export default ProductDetails;
