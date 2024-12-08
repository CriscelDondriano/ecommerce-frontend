import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Card, Button } from 'react-bootstrap';

const ReceiptPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Fetch orderSummary from navigation state
    const orderSummary = location.state?.orderSummary;

    // If orderSummary is undefined, show an error message and a cancel button
    if (!orderSummary) {
        return (
            <Container className="mt-5">
                <h5>No Order Summary Found</h5>
                <Button variant="danger" onClick={() => navigate('/checkout')}>
                    Cancel
                </Button>
            </Container>
        );
    }

    // Destructure properties with default values to handle missing fields
    const {
        shippingDetails = {},
        paymentMethod = 'Unknown',
        cartItems = [],
    } = orderSummary;

    // Calculate the total price
    const totalPrice = cartItems.reduce((total, item) => {
        const itemTotal = (item.price || 0) * (item.quantity || 1); // Default quantity to 1
        return total + itemTotal;
    }, 0);

    return (
        <Container className="mt-5">
            <Card>
                <Card.Body>
                    <h5 className="mb-4">Order Receipt</h5>
                    <p>
                        <strong>Name:</strong> {shippingDetails.name || 'N/A'}
                    </p>
                    <p>
                        <strong>Phone:</strong> {shippingDetails.phoneNumber || 'N/A'}
                    </p>
                    <p>
                        <strong>Address:</strong>{' '}
                        {`${shippingDetails.street || 'N/A'}, ${shippingDetails.barangay || ''}, 
                        ${shippingDetails.city || ''}, ${shippingDetails.province || ''}, 
                        ${shippingDetails.region || ''}`.trim()}
                    </p>
                    <p>
                        <strong>Payment Method:</strong> {paymentMethod}
                    </p>
                    <hr />
                    <h5>Items:</h5>
                    <ul className="list-unstyled">
                        {cartItems.map((item) => (
                            <li
                                key={item.id}
                                className="d-flex justify-content-between align-items-center"
                            >
                                <span>
                                    {item.name} - Quantity: {item.quantity || 1}
                                </span>
                                <span>₱{((item.price || 0) * (item.quantity || 1)).toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                    <hr />
                    <h6 className="text-right">
                        Total: ₱{totalPrice.toFixed(2)}
                    </h6>
                    <div className="d-flex justify-content-between mt-3">
                        <Button
                            variant="success"
                            onClick={() => navigate('/store')}
                        >
                            Confirm
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ReceiptPage;
