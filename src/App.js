import React from 'react';
import { Routes, Route } from 'react-router-dom'; 
import LoginForm from './components/LoginForm'; 
import ProductManagement from './components/ProductManagement'; 
import ProductDetails from './components2/ProductDetails';
import Userpage from './components2/Userpage';
import Cart from './components2/Cart'; 
import CheckoutPage from './components2/CheckoutPage';

const App = () => {
    return (
        
        <Routes> {/* Define the routing for the application */}
            <Route path="/" element={<LoginForm />} /> {/* Route for the home path, renders the LoginForm component */}
            <Route path="/ProductManagement" element={<ProductManagement />} /> {/* Route for Product Management, renders the ProductManagement component */}
            <Route path="/store" element={<Userpage />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} /> {/* Add this line */}
            <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
    );
}

export default App;