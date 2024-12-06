import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]); // Track selected items
    const [quantities, setQuantities] = useState({}); // Track quantity of each item

    useEffect(() => {
        // Fetch cart items from local storage or API
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(storedCart);
    }, []);

    const handleRemoveFromCart = (productId) => {
        const updatedCart = cartItems.filter(item => item.id !== productId);
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart)); // Update local storage
    };

    const handleSelectItem = (productId) => {
        setSelectedItems(prevSelectedItems =>
            prevSelectedItems.includes(productId)
                ? prevSelectedItems.filter(id => id !== productId) // Deselect
                : [...prevSelectedItems, productId] // Select
        );
    };

    const handleQuantityChange = (productId, quantity) => {
        if (quantity < 1) return; // Prevent quantity from going below 1
        setQuantities(prevQuantities => ({
            ...prevQuantities,
            [productId]: quantity
        }));
    };

    const calculateTotalPrice = () => {
        return cartItems.filter(item => selectedItems.includes(item.id))
                        .reduce((total, item) => {
                            const quantity = quantities[item.id] || 1; // Default quantity is 1
                            return total + item.price * quantity;
                        }, 0);
    };

    const calculateTotalItems = () => {
        return selectedItems.length;
    };

    return (
        <Container>
            <h1>Your Cart</h1>
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Select</th>
                            <th>Product Name</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cartItems.map(item => (
                            <tr key={item.id}>
                                <td>
                                    <Form.Check
                                        type="checkbox"
                                        checked={selectedItems.includes(item.id)}
                                        onChange={() => handleSelectItem(item.id)} // Toggle selection
                                    />
                                </td>
                                <td>{item.name}</td>
                                <td>₱{item.price}</td>
                                <td>
                                    <Form.Control
                                        type="number"
                                        value={quantities[item.id] || 1} // Default to 1 if not set
                                        onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                        min="1"
                                    />
                                </td>
                                <td>
                                    <Button variant="danger" onClick={() => handleRemoveFromCart(item.id)}>
                                        Remove
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            <div className="d-flex justify-content-between">
                <Link to="/store">
                    <Button variant="primary">Continue Shopping</Button>
                </Link>

                <div>
                    <h4>Total Items: {calculateTotalItems()}</h4> {/* Total selected items */}
                    <h4>Total: ₱{calculateTotalPrice()}</h4> {/* Total price of selected items */}
                    <Link to="/checkout">
                        <Button variant="success">Checkout</Button>
                    </Link>
                </div>
            </div>
        </Container>
    );
};

export default Cart;