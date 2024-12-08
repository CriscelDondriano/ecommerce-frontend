import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form, Modal, Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faMagnifyingGlass, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

const UserPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cartCount, setCartCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [quantities, setQuantities] = useState({});
    const [showModal, setShowModal] = useState(false); // State for showing the modal
    const [modalMessage, setModalMessage] = useState(''); // Message to show in the modal
    const [showConfirmation, setShowConfirmation] = useState(false); // State for the confirmation modal
    const [productToAdd, setProductToAdd] = useState(null); // State for the product being added
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/products');
                const response = await axios.get('http://localhost:8000/api/products');
                setProducts(response.data);
                const initialQuantities = {};
                response.data.forEach((product) => {
                    initialQuantities[product.id] = 1;
                    initialQuantities[product.id] = 1;
                });
                setQuantities(initialQuantities);
            } catch (err) {
                setError('Failed to fetch products. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
        updateCartCount();
        updateCartCount();
    }, []);

    const updateCartCount = () => {
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartCount(storedCart.length);
    };

    const handleLogout = () => {
        localStorage.removeItem('user-info'); // Clear user session
        navigate('/'); // Redirect to login page
    };

    const handleAddToCart = (product) => {
        setProductToAdd(product); // Set the product to be added
        setShowConfirmation(true); // Show confirmation modal
    };

    const confirmAddToCart = () => {
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingProductIndex = storedCart.findIndex(item => item.id === productToAdd.id);

        const quantityToAdd = quantities[productToAdd.id] || 1;

        if (existingProductIndex > -1) {
            storedCart[existingProductIndex].quantity += quantityToAdd;
        } else {
            storedCart.push({ ...productToAdd, quantity: quantityToAdd });
        }

        localStorage.setItem('cart', JSON.stringify(storedCart));
        setModalMessage('Product added to cart successfully!');
        setShowModal(true);
        setShowConfirmation(false);
        updateCartCount();
    };

    const handleQuantityChange = (productId, action) => {
        setQuantities((prevQuantities) => {
            const currentQuantity = prevQuantities[productId];
            const newQuantity =
                action === 'increment'
                    ? Math.min(currentQuantity + 1, products.find((p) => p.id === productId).quantity)
                    : Math.max(currentQuantity - 1, 1);
            return { ...prevQuantities, [productId]: newQuantity };
        });
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleCategoryChange = (category) => {
        if (selectedCategories.includes(category)) {
            setSelectedCategories(selectedCategories.filter((cat) => cat !== category));
        } else {
            setSelectedCategories([...selectedCategories, category]);
        }
    };

    const handleCheckout = (product) => {
        const selectedCartItems = [{ ...product, quantity: quantities[product.id] }];
        navigate('/checkout', { state: { selectedCartItems } });
    };

    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
        return matchesSearch && matchesCategory;
    });

    if (loading) {
        return <p>Loading products...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    const categories = ['Mobile', 'TV & AV', 'Laptop', 'Home Appliances', 'Accessories'];

    return (
        <Container>
            {/* Logout Button */}
            <div className="d-flex justify-content-between align-items-center mt-4">
                <h1>Welcome to Our Store</h1>
                <Button variant="dark" onClick={handleLogout}>
                    Logout
                </Button>
            </div>

            <div className="d-flex justify-content-end mb-4">
                <Button variant="dark" onClick={() => navigate('/cart')} className="position-relative">
                    <FontAwesomeIcon icon={faCartShopping} />
                    {cartCount > 0 && (
                        <Badge pill bg="danger" style={{ position: 'absolute', top: '-10px', right: '-10px' }}>
                            {cartCount}
                        </Badge>
                    )}
                </Button>
            </div>

            <Form className="mb-4">
                <div style={{ position: 'relative' }}>
                    {/* Input Field */}
                    <Form.Control
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }} 
                    />
                    
                    {/* Search Icon */}
                    <FontAwesomeIcon
                        icon={faMagnifyingGlass}
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '10px',
                            transform: 'translateY(-50%)',
                            color: 'gray',
                        }}
                    />

                    {/* Clear Text Button */}
                    {searchQuery && (
                        <FontAwesomeIcon
                            icon={faTimesCircle}
                            style={{
                                position: 'absolute',
                                top: '50%',
                                right: '10px',
                                transform: 'translateY(-50%)',
                                color: 'gray',
                                cursor: 'pointer',
                            }}
                            onClick={() => setSearchQuery('')} 
                        />
                    )}
                </div>
            </Form>

            <div className="mb-4">
    <Row className="d-flex justify-content-start" style={{ flexWrap: 'nowrap' }}>
        {categories.map((category) => (
            <Col key={category} xs="auto" className="mb-2">
                <Form.Check
                    type="checkbox"
                    label={category}
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                    className="custom-checkbox" // Apply the custom styling class
                />
            </Col>
        ))}
    </Row>
</div>


            <Row>
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <Col key={product.id} md={4} className="mb-4">
                            <Card className="product-card">
                                <Card.Body>
                                    <Card.Title>
                                    <Nav.Link as={Link} to={`/products/${product.id}`} className="product-link">
                                        {product.name}
                                    </Nav.Link>
                                    </Card.Title>
                                    <Card.Text>₱{product.price}</Card.Text>
                                    <Card.Text>
                                        <strong>Available:</strong> {product.quantity} pieces
                                    </Card.Text>
                                    <div className="d-flex align-items-center mb-3">
                                        <Button
                                            variant="outline-secondary"
                                            size="sm"
                                            onClick={() => handleQuantityChange(product.id, 'decrement')}
                                            disabled={quantities[product.id] === 1}
                                        >
                                            -
                                        </Button>
                                        <span className="mx-3">{quantities[product.id]}</span>
                                        <Button
                                            variant="outline-secondary"
                                            size="sm"
                                            onClick={() => handleQuantityChange(product.id, 'increment')}
                                            disabled={quantities[product.id] >= product.quantity}
                                        >
                                            +
                                        </Button>
                                    </div>
                                    <div className="d-flex flex-column">
                                        <Button variant="outline-dark" onClick={() => handleAddToCart(product)} className="mb-2">
                                            Add to Cart
                                        </Button>
                                        <Button variant="dark" onClick={() => handleCheckout(product)}>
                                            Buy Now
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <Col>
                        <p>No products found.</p>
                    </Col>
                )}
            </Row>

            {/* Confirmation Modal */}
            <Modal show={showConfirmation} onHide={() => setShowConfirmation(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Add to Cart</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to add this product to the cart?</Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-dark" onClick={() => setShowConfirmation(false)}>
                        Cancel
                    </Button>
                    <Button variant="dark" onClick={confirmAddToCart}>
                        Yes, Add to Cart
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Success Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Success</Modal.Title>
                </Modal.Header>
                <Modal.Body>{modalMessage}</Modal.Body>
                <Modal.Footer>
                    <Button variant="dark" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default UserPage;
