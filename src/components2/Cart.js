import React, { useEffect, useState } from 'react';
import { Table, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState(new Set());
    const navigate = useNavigate();

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        const groupedCart = storedCart.reduce((acc, item) => {
            const existingItem = acc.find(i => i.id === item.id);
            if (existingItem) {
                existingItem.quantity += item.quantity;
            } else {
                acc.push({ ...item });
            }
            return acc;
        }, []);
        
        setCartItems(groupedCart);
    }, []);

    const handleRemoveFromCart = (id) => {
        const updatedCart = cartItems.filter(item => item.id !== id);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        setCartItems(updatedCart);
        selectedItems.delete(id);
        setSelectedItems(new Set(selectedItems));
    };

    const handleQuantityChange = (id, newQuantity) => {
        if (newQuantity < 1) return;

        const updatedCart = cartItems.map(item => {
            if (item.id === id) {
                return { ...item, quantity: newQuantity };
            }
            return item;
        });

        localStorage.setItem('cart', JSON.stringify(updatedCart));
        setCartItems(updatedCart);
    };

    const handleCheckout = () => {
        if (cartItems.length === 0) {
            alert("Your cart is empty. Please add items to the cart before checking out.");
            return;
        }

        if (selectedItems.size === 0) {
            alert("Please select at least one item to proceed to checkout.");
            return;
        }

        const remainingCartItems = cartItems.filter(item => !selectedItems.has(item.id));
        const selectedCartItems = cartItems.filter(item => selectedItems.has(item.id));

        localStorage.setItem('cart', JSON.stringify(remainingCartItems));

        // Pass selected items to checkout
        navigate('/checkout', { state: { selectedCartItems } });
    };

    const handleContinueShopping = () => {
        navigate('/store');
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

    const totalItems = Array.from(selectedItems).reduce((acc, id) => {
        const item = cartItems.find(item => item.id === id);
        return acc + (item ? item.quantity : 0);
    }, 0);

    const totalAmount = Array.from(selectedItems).reduce((acc, id) => {
        const item = cartItems.find(item => item.id === id);
        return acc + (item ? item.price * item.quantity : 0);
    }, 0);

    return (
        <div>
            <h1>Your Cart</h1>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Select</th>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {cartItems.map(item => (
                        <tr key={item.id}>
                            <td>
                                <Form.Check
                                    type="checkbox"
                                    checked={selectedItems.has(item.id)}
                                    onChange={() => handleSelectItem(item.id)}
                                />
                            </td>
                            <td>{item.name}</td>
                            <td>₱{item.price}</td>
                            <td>
                                <Form.Control
                                    type="number"
                                    value={item.quantity}
                                    min="1"
                                    onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
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
            <div className="d-flex justify-content-between mt-4">
                <div>
                    <h5>Total Items: {totalItems}</h5>
                    <h5>Total Amount: ₱{totalAmount.toFixed(2)}</h5>
                </div>
                <div>
                    <Button variant="success" onClick={handleCheckout}>
                        Checkout
                    </Button>
                    <Button variant="primary" onClick={handleContinueShopping}>
                        Continue Shopping
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Cart;
