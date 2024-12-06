import React, { useState } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
    const [shippingDetails, setShippingDetails] = useState({
        fullName: '',
        address: '',
        city: '',
        postalCode: '',
        country: ''
    });
    const [paymentMethod, setPaymentMethod] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShippingDetails({ ...shippingDetails, [name]: value });
    };

    const handlePaymentChange = (e) => {
        setPaymentMethod(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!paymentMethod) {
            alert('Please select a payment method.');
            return;
        }

        // Save order details to localStorage (or send to backend)
        const orderSummary = {
            shippingDetails,
            paymentMethod,
            cartItems: JSON.parse(localStorage.getItem('cart')) || []
        };

        console.log('Order Summary:', orderSummary); // For debugging
        alert('Order placed successfully!');

        // Clear cart and redirect to store page
        localStorage.removeItem('cart');
        navigate('/store'); // Redirecting to the store page
    };

    return (
        <Container className="mt-4">
            <h1>Checkout</h1>
            <Form onSubmit={handleSubmit}>
                <h4>Shipping Details</h4>
                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter full name"
                                name="fullName"
                                value={shippingDetails.fullName}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Address</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter address"
                                name="address"
                                value={shippingDetails.address}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col md={4}>
                        <Form.Group>
                            <Form.Label>City</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter city"
                                name="city"
                                value={shippingDetails.city}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group>
                            <Form.Label>Postal Code</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter postal code"
                                name="postalCode"
                                value={shippingDetails.postalCode}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group>
                            <Form.Label>Country</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter country"
                                name="country"
                                value={shippingDetails.country}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <h4>Payment Method</h4>
                <Form.Group className="mb-3">
                    <Form.Check
                        type="radio"
                        label="Online Banking"
                        value="Online Banking"
                        name="paymentMethod"
                        onChange={handlePaymentChange}
                        required
                    />
                    <Form.Check
                        type="radio"
                        label="Cash on Delivery"
                        value="Cash on Delivery"
                        name="paymentMethod"
                        onChange={handlePaymentChange}
                        required
                    />
                </Form.Group>

                <Button variant="success" type="submit">
                    Confirm Order
                </Button>
                <Button
                    variant="danger"
                    className="ms-2"
                    onClick={() => navigate('/store')}
                >
                    Cancel
                </Button>
            </Form>
        </Container>
    );
};

export default CheckoutPage;
