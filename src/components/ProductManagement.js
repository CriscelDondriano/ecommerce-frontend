import React, { useState, useEffect, useCallback } from 'react';
import { getProducts, addProduct, updateProduct, deleteProduct } from '../api/ProductService';
import AddProduct from './AddProduct';
import EditProduct from './EditProduct';
import Dashboard from './Dashboard';
import { Alert, Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [formData, setFormData] = useState({ barcode: '', name: '', description: '', price: '', quantity: '', category: '' });
    const [editMode, setEditMode] = useState(false);
    const [currentProductId, setCurrentProductId] = useState(null);
    const [message, setMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [view, setView] = useState('dashboard');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showDeletePrompt, setShowDeletePrompt] = useState(false); // State for delete prompt
    const navigate = useNavigate();

    const fetchProducts = useCallback(async () => {
        try {
            const response = await getProducts();
            setProducts(response.data);
            setFilteredProducts(response.data);
        } catch (err) {
            setError('Failed to fetch products. Please try again later.');
            clearMessage();
            console.error('Error fetching products:', err);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const clearMessage = () => {
        setTimeout(() => {
            setMessage('');
            setError('');
        }, 5000);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('http://localhost:8000/api/products/search', {
                params: { query: searchQuery }
            });
            setFilteredProducts(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching search results:', error);
            setError('Failed to fetch search results.');
            setLoading(false);
        }
    };

    const handleEdit = (product) => {
        setFormData(product);
        setEditMode(true);
        setCurrentProductId(product.id);
        setView('edit');
    };

    const resetForm = () => {
        setFormData({ barcode: '', name: '', description: '', price: '', quantity: '', category: '' });
        setEditMode(false);
        setCurrentProductId(null);
        setSearchQuery('');
        setFilteredProducts(products);
    };

    const [deletionId, setDeletionId] = useState(null);

    const handleDelete = (id) => {
        setDeletionId(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            await deleteProduct(deletionId);
            fetchProducts();
            clearMessage();
            setShowDeleteModal(false);
            setShowDeletePrompt(true); // Show the delete prompt
            setTimeout(() => {
                setShowDeletePrompt(false); // Hide prompt after a delay
            }, 2000);
        } catch (err) {
            setError('An error occurred while deleting the product. Please try again.');
            clearMessage();
            console.error('Error deleting product:', err);
        } finally {
            setDeletionId(null);
        }
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setDeletionId(null);
    };

    const handleSwitchView = (viewName) => {
        setView(viewName);
        resetForm();
    };

    const logOut = () => {
        setShowLogoutModal(true);
    };

    const confirmLogout = () => {
        // Clear user information from localStorage
        localStorage.removeItem("user-info");

        // Navigate to the login page with replace to prevent going back
        navigate("/", { replace: true });

        // Optionally prevent going back to the previous page
        window.history.pushState(null, "", window.location.href);
        window.onpopstate = function () {
            window.history.go(1);
        };

        setShowLogoutModal(false);
    };

    const cancelLogout = () => {
        setShowLogoutModal(false);
    };

    return (
        <div>
             <h2 className="text-center mt-3">Product Management</h2>
            {error && <Alert variant="danger" style={{ marginLeft: '20px' }}>{error}</Alert>}
            {message && <Alert variant="success" style={{ marginLeft: '20px' }}>{message}</Alert>}

            {/* Display buttons side by side */}
            <div style={{display: 'flex', justifyContent: 'flex-end', marginRight: '100px', marginBottom: '20px'}}>
                <Button onClick={() => handleSwitchView('dashboard')} variant="dark" style={{ marginRight: '10px' }}>
                    Product List
                </Button>
                <Button onClick={() => handleSwitchView('add')} variant="dark" style={{ marginRight: '10px' }}>
                    Add Product
                </Button>
                <Button onClick={logOut} variant="dark">
                    Logout
                </Button>
            </div>

            {view === 'dashboard' && (
                <Dashboard
                    products={filteredProducts}
                    handleSearchChange={handleSearchChange}
                    handleSearch={handleSearch}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                    searchQuery={searchQuery}
                    loading={loading}
                    categories={['Mobile', 'TV & AV', 'Laptop', 'Home Appliances', 'Accessories']}
                />
            )}

            {view === 'add' && (
                <AddProduct
                    formData={formData}
                    setFormData={setFormData}
                    addProduct={addProduct}
                    fetchProducts={fetchProducts}
                    setMessage={setMessage}
                    setError={setError}
                    clearMessage={clearMessage}
                />
            )}

            {view === 'edit' && editMode && (
                <EditProduct
                    formData={formData}
                    setFormData={setFormData}
                    updateProduct={updateProduct}
                    currentProductId={currentProductId}
                    fetchProducts={fetchProducts}
                    setMessage={setMessage}
                    setError={setError}
                    clearMessage={clearMessage}
                />
            )}

            {/* Logout Confirmation Modal */}
            <Modal show={showLogoutModal} onHide={cancelLogout}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Logout</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to logout?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={cancelLogout}>
                        Cancel
                    </Button>
                    <Button variant="success" onClick={confirmLogout}>
                        Logout
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this product?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDeleteModal}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={confirmDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Simple Prompt after Product Deletion */}
            <Modal show={showDeletePrompt} onHide={() => setShowDeletePrompt(false)}>
                <Modal.Header>
                    <Modal.Title>Product Deleted</Modal.Title>
                </Modal.Header>
                <Modal.Body>Your product has been deleted successfully!</Modal.Body>
            </Modal>
        </div>
    );
};

export default ProductManagement;
