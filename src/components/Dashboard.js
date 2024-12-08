import React, { useState } from 'react';
import { Card, Container, Row, Col, Form } from 'react-bootstrap';
import ProductList from './ProductList';
import SearchBar from './Searchbar';

/**
 * Dashboard component that displays a list of products, a search bar, and category checkboxes.
 * 
 * @param {Object} props - Component props
 * @param {Array} props.products - List of products to display
 * @param {Function} props.handleEdit - Handler for editing a product
 * @param {Function} props.handleDelete - Handler for deleting a product
 * @param {String} props.searchQuery - Current search query
 * @param {Boolean} props.loading - Flag indicating whether data is being fetched
 * @param {String} props.error - Error message if something goes wrong
 * @param {Function} props.handleSearchChange - Handler for search input changes
 * @param {Function} props.handleSearch - Handler for search form submission
 * @param {Array} props.categories - List of product categories
 */
const Dashboard = ({
    products,
    handleEdit,
    handleDelete,
    searchQuery,
    loading,
    error,
    handleSearchChange,
    handleSearch,
    categories // Add categories prop
}) => {
  // State to manage selected categories
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Function to handle checkbox change
  const handleCategoryChange = (category) => {
    if (selectedCategories.includes(category)) {
      // Remove category if already selected
      setSelectedCategories(selectedCategories.filter((cat) => cat !== category));
    } else {
      // Add category to selected categories
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  // Filter products based on selected categories
  const filteredProducts = selectedCategories.length > 0
    ? products.filter((product) => selectedCategories.includes(product.category))
    : products;

  return (
    <Container className="d-flex justify-content-center mt-5">
      <Card className="w-100">
        <Card.Body>
          {/* Row element to display the title, search bar, and category checkboxes */}
          <Row className="align-items-center mb-4">
            <Col xs={12} md={6}>
              {/* Title of the product list */}
              <Card.Title>Product List</Card.Title>
            </Col>
            <Col xs={12} md={6} className="text-md-end text-center">
              {/* Search bar component with props for handling search input and submission */}
              <SearchBar
                handleSearchChange={handleSearchChange}
                handleSearch={handleSearch}
                searchQuery={searchQuery}
              />
            </Col>
          </Row>

          {/* Category checkboxes */}
          <Row className="mb-3">
            <Col xs={12}>
              <Form>
                <Row className="d-flex justify-content-start" style={{ flexWrap: 'nowrap' }}>
                  {categories.map((category, index) => (
                    <Col key={index} xs="auto" className="mb-2">
                      <Form.Check
                        type="checkbox"
                        label={category}
                        checked={selectedCategories.includes(category)}
                        onChange={() => handleCategoryChange(category)}
                        className="custom-checkbox"
                      />
                    </Col>
                  ))}
                </Row>
              </Form>
            </Col>
          </Row>

          {/* Conditional rendering for loading, error, and products */}
          {loading && <p>Loading...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}

          {!loading && !error && (
            filteredProducts.length === 0 ? (
              <Card style={{ marginTop: '20px', padding: '20px', textAlign: 'center' }}>
                <Card.Body>
                  <Card.Text>No products available</Card.Text>
                </Card.Body>
              </Card>
            ) : (
              <ProductList
                products={filteredProducts} // Display filtered products
                handleEdit={handleEdit}
                handleDelete={handleDelete}
              />
            )
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

// Export the Dashboard component as the default export
export default Dashboard;
