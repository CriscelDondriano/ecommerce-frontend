import React, { useEffect, useState } from 'react';
import { Table, Button, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
                setCartItems(storedCart);
                setLoading(false);

                const response = await axios.get('http://localhost:8000/api/products');
                const products = response.data;

                const updatedCart = storedCart.map((item) => {
                    const product = products.find((p) => p.id === item.id);
                    if (product) {
                        return {
                            ...item,
                            availableQuantity: product.quantity,
                            price: product.price,
                        };
                    }
                    return { ...item, availableQuantity: 0 };
                });

                setCartItems(updatedCart);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch product data. Please try again later.');
                setLoading(false);
            }
        };

        fetchCartItems();
    }, []);

    const handleQuantityChange = (id, action) => {
        const updatedCart = cartItems.map((item) => {
            if (item.id === id) {
                const newQuantity =
                    action === 'increment'
                        ? Math.min(item.quantity + 1, item.availableQuantity)
                        : Math.max(item.quantity - 1, 1);
                return { ...item, quantity: newQuantity };
            }
            return item;
        });

        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const handleRemoveFromCart = (id) => {
        const updatedCart = cartItems.filter((item) => item.id !== id);
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));

        const updatedSelectedItems = new Set(selectedItems);
        updatedSelectedItems.delete(id);
        setSelectedItems(updatedSelectedItems);
    };

    const handleCheckout = () => {
        const selectedCartItems = cartItems.filter((item) => selectedItems.has(item.id));
        navigate('/checkout', { state: { selectedCartItems, from: 'viewCart' } });
    };

    const handleContinueShopping = () => {
        navigate('/store', { state: { from: 'viewCart' } });
    };

    const handleSelectItem = (id) => {
        const updatedSelectedItems = new Set(selectedItems);
        if (updatedSelectedItems.has(id)) {
            updatedSelectedItems.delete(id);
        } else {
            updatedSelectedItems.add(id);
        }
        setSelectedItems(updatedSelectedItems);
    };

    const handleSelectAll = () => {
        if (selectedItems.size === cartItems.length) {
            setSelectedItems(new Set());
        } else {
            const allItemIds = cartItems.map((item) => item.id);
            setSelectedItems(new Set(allItemIds));
        }
    };

    const totalItems = Array.from(selectedItems).reduce((acc, id) => {
        const item = cartItems.find((item) => item.id === id);
        return acc + (item ? item.quantity : 0);
    }, 0);

    const totalAmount = Array.from(selectedItems).reduce((acc, id) => {
        const item = cartItems.find((item) => item.id === id);
        return acc + (item ? item.price * item.quantity : 0);
    }, 0);

    if (loading) {
        return <p>Loading cart...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    return (
        <div className="container mt-4">
            <h1>Your Cart</h1>
            {cartItems.length === 0 ? (
                <div>
                    <Alert variant="dark">Your cart is empty. Start adding items!</Alert>
                    <Button variant="dark" onClick={handleContinueShopping}>
                        Continue Shopping
                    </Button>
                </div>
            ) : (
                <>
                    <div className="d-flex align-items-center mb-3">
                        <Form.Check
                            type="checkbox"
                            label="Select All"
                            checked={selectedItems.size === cartItems.length}
                            onChange={handleSelectAll}
                            className="custom-checkbox"
                        />
                    </div>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Select</th>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Total Price</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        <Form.Check
                                            type="checkbox"
                                            checked={selectedItems.has(item.id)}
                                            onChange={() => handleSelectItem(item.id)}
                                            className="custom-checkbox"
                                        />
                                    </td>
                                    <td>{item.name}</td>
                                    <td>₱{item.price}</td>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <Button
                                                variant="outline-secondary"
                                                size="sm"
                                                onClick={() => handleQuantityChange(item.id, 'decrement')}
                                                disabled={item.quantity === 1}
                                            >
                                                -
                                            </Button>
                                            <span className="mx-3">{item.quantity}</span>
                                            <Button
                                                variant="outline-secondary"
                                                size="sm"
                                                onClick={() => handleQuantityChange(item.id, 'increment')}
                                                disabled={item.quantity >= item.availableQuantity}
                                            >
                                                +
                                            </Button>
                                        </div>
                                    </td>
                                    <td>₱{(item.price * item.quantity).toFixed(2)}</td>
                                    <td>
                                        <Button
                                            className="w-100"
                                            variant="dark"
                                            onClick={() => handleRemoveFromCart(item.id)}
                                        >
                                            <FontAwesomeIcon icon={faTrashCan} />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <div className="d-flex justify-content-between mt-4"> 
                        <div>
                            <h6>Total Items: {totalItems}</h6>
                            <h6>Grand Total: ₱{totalAmount.toFixed(2)}</h6>
                        </div>
                        <div>
                            <div style={{ marginTop: '20px' }}> 
                                <Button variant="dark" onClick={handleCheckout} disabled={selectedItems.size === 0}>
                                    Checkout
                                </Button>
                                <Button variant="outline-dark" onClick={handleContinueShopping} className="ms-2">
                                    Continue Shopping
                                </Button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;
