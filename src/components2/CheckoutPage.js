import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';

const CheckoutPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const selectedCartItems = location.state?.selectedCartItems || [];
    const [paymentMethod, setPaymentMethod] = useState('');
    const [shippingDetails, setShippingDetails] = useState({
        name: '',
        phoneNumber: '',
        region: '',
        province: '',
        city: '',
        barangay: '',
        street: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!paymentMethod) {
            alert('Please select a payment method.');
            return;
        }

        // Validate that all shipping details are filled
        const requiredFields = ['name', 'phoneNumber', 'region', 'province', 'city', 'barangay', 'street'];
        for (const field of requiredFields) {
            if (!shippingDetails[field]) {
                alert(`Please fill out the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field.`);
                return;
            }
        }

        // Save order details to localStorage (or send to backend)
        const orderSummary = {
            shippingDetails,
            paymentMethod,
            cartItems: selectedCartItems, // Use only the selected items
        };

        console.log('Order Summary:', orderSummary); // For debugging
        alert('Order placed successfully!');

        // Clear only the selected items from the cart
        const remainingCartItems = JSON.parse(localStorage.getItem('cart')) || [];
        const updatedCartItems = remainingCartItems.filter(
            (item) => !selectedCartItems.some((selected) => selected.id === item.id)
        );
        localStorage.setItem('cart', JSON.stringify(updatedCartItems));

        navigate('/store'); // Redirecting to the store page
    };

    return (
        <Container className="mt-5">
            <h1 className="text-center mb-4">Checkout</h1>
            <Row>
                <Col md={6}>
                    <Card className="mb-4">
                        <Card.Body>
                            <h5>Shipping Details</h5>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="formName">
                                    <Form.Label>Full Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={shippingDetails.name}
                                        onChange={(e) =>
                                            setShippingDetails({ ...shippingDetails, name: e.target.value })
                                        }
                                        placeholder="Enter your full name"
                                        required
                                    />
                                </Form.Group>
                                <Form.Group controlId="formPhoneNumber">
                                    <Form.Label>Phone Number</Form.Label>
                                    <Form.Control
                                        type="tel"
                                        value={shippingDetails.phoneNumber}
                                        onChange={(e) =>
                                            setShippingDetails({ ...shippingDetails, phoneNumber: e.target.value })
                                        }
                                        placeholder="Enter your phone number"
                                        required
                                    />
                                </Form.Group>
                                <Form.Group controlId="formRegion">
                                    <Form.Label>Region</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={shippingDetails.region}
                                        onChange={(e) =>
                                            setShippingDetails({ ...shippingDetails, region: e.target.value })
                                        }
                                        placeholder="Enter your region"
                                        required
                                    />
                                </Form.Group>
                                <Form.Group controlId="formProvince">
                                    <Form.Label>Province</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={shippingDetails.province}
                                        onChange={(e) =>
                                            setShippingDetails({ ...shippingDetails, province: e.target.value })
                                        }
                                        placeholder="Enter your province"
                                        required
                                    />
                                </Form.Group>
                                <Form.Group controlId="formCity">
                                    <Form.Label>City</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={shippingDetails.city}
                                        onChange={(e) =>
                                            setShippingDetails({ ...shippingDetails, city: e.target.value })
                                        }
                                        placeholder="Enter your city"
                                        required
                                    />
                                </Form.Group>
                                <Form.Group controlId="formBarangay">
                                    <Form.Label>Barangay</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={shippingDetails.barangay}
                                        onChange={(e) =>
                                            setShippingDetails({ ...shippingDetails, barangay: e.target.value })
                                        }
                                        placeholder="Enter your barangay"
                                        required
                                    />
                                </Form.Group>
                                <Form.Group controlId="formStreet">
                                    <Form.Label>Street/Building/House No.</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={shippingDetails.street}
                                        onChange={(e) =>
                                            setShippingDetails({ ...shippingDetails, street: e.target.value })
                                        }
                                        placeholder="Enter your street, building, or house number"
                                        required
                                    />
                                </Form.Group>
                                <Form.Group controlId="formPaymentMethod" className="mt-3">
                                    <Form.Label>Payment Method</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={paymentMethod}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        required
                                    >
                                        <option value="">Select a payment method</option>
                                        <option value="creditCard">Credit Card</option>
                                        <option value="paypal">PayPal</option>
                                        <option value="bankTransfer">Bank Transfer</option>
                                        <option value="cod">Cash on Delivery</option>
                                    </Form.Control>
                                </Form.Group>
                                <Button variant="primary" type="submit" className="mt-3">
                                    Place Order
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card>
                        <Card.Body>
                            <h5>Order Summary</h5>
                            <ul className="list-unstyled">
                                {selectedCartItems.map((item) => (
                                    <li
                                        key={item.id}
                                        className="d-flex justify-content-between align-items-center"
                                    >
                                        <span>
                                            {item.name} - Quantity: {item.quantity}
                                        </span>
                                        <span>₱{(item.price * item.quantity).toFixed(2)}</span>
                                    </li>
                                ))}
                            </ul>
                            <hr />
                            <h6 className="text-right">
                                Total: ₱
                                {selectedCartItems
                                    .reduce(
                                        (total, item) => total + item.price * item.quantity,
                                        0
                                    )
                                    .toFixed(2)}
                            </h6>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default CheckoutPage;
