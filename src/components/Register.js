import React, { useState } from "react";
import { Form, Button, Container, Card, Alert, InputGroup } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    contact: "",
  });

  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePasswordStrength = (password) => {
    const hasUpperCase = /[A-Z]/.test(password); // Checks for uppercase letter
    const hasLowerCase = /[a-z]/.test(password); // Checks for lowercase letter
    const hasNumbers = /\d/.test(password); // Checks for numbers
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password); // Checks for special characters
    const minLength = 8; // Minimum password length for strong password
  
    if (password.length < minLength) {
      setPasswordStrength("Weak");
    } else if (
      hasUpperCase &&
      hasLowerCase &&
      hasNumbers &&
      hasSpecialChar
    ) {
      setPasswordStrength("Strong");
    } else if (password.length >= minLength) {
      setPasswordStrength("Medium");
    } else {
      setPasswordStrength("Weak");
    }
  };
  

  const validateContact = (contact) => /^\d{10,15}$/.test(contact);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "email" && value) {
      setErrors({ ...errors, email: !validateEmail(value) ? "Invalid email" : "" });
    }

    if (name === "password") {
      validatePasswordStrength(value);
    }

    if (name === "contact") {
      setErrors({
        ...errors,
        contact: !validateContact(value) ? "Invalid contact number (10-15 digits required)" : "",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, password_confirmation, contact } = formData;
    let formErrors = {};

    if (!name) formErrors.name = "Name is required";
    if (!email) formErrors.email = "Email is required";
    else if (!validateEmail(email)) formErrors.email = "Invalid email";
    if (!password) formErrors.password = "Password is required";
    if (!password_confirmation) formErrors.password_confirmation = "Please confirm your password";
    else if (password !== password_confirmation) formErrors.password_confirmation = "Passwords do not match";
    if (!contact) formErrors.contact = "Contact is required";
    else if (!validateContact(contact)) formErrors.contact = "Invalid contact number";

    if (Object.keys(formErrors).length === 0) {
      setIsSubmitting(true);
      try {
        const response = await axios.post("http://localhost:8000/api/register", {
          name,
          email,
          password,
          password_confirmation,
          contact,
        });

        console.log("Registration successful:", response.data);
        navigate("/");
      } catch (error) {
        if (error.response && error.response.data.errors) {
          setErrors(error.response.data.errors);
        } else if (error.response && error.response.data.message) {
          setErrors({ general: error.response.data.message });
        } else {
          setErrors({ general: "An unexpected error occurred" });
        }
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setErrors(formErrors);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
      <Card style={{ width: "100%", maxWidth: "500px", padding: "20px" }}>
        <Card.Title className="text-center mb-4">Register</Card.Title>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            {errors.general && <Alert variant="danger">{errors.general}</Alert>}

            <Form.Group className="mb-3" controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                isInvalid={!!errors.name}
              />
              <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <InputGroup>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => {
                  handleChange(e);
                  validatePasswordStrength(e.target.value);
                }}
                isInvalid={!!errors.password}
              />
              <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
              {passwordStrength && (
                <Form.Text
                  className={`text-${passwordStrength === "Strong" ? "success" : passwordStrength === "Medium" ? "warning" : "danger"}`}
                >
                  Password Strength: {passwordStrength}
                </Form.Text>
              )}
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPasswordConfirmation">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                name="password_confirmation"
                placeholder="Confirm your password"
                value={formData.password_confirmation}
                onChange={handleChange}
                isInvalid={!!errors.password_confirmation}
              />
              <Form.Control.Feedback type="invalid">{errors.password_confirmation}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formContact">
              <Form.Label>Contact</Form.Label>
              <Form.Control
                type="text"
                name="contact"
                placeholder="Enter your contact number"
                value={formData.contact}
                onChange={handleChange}
                isInvalid={!!errors.contact}
              />
              <Form.Control.Feedback type="invalid">{errors.contact}</Form.Control.Feedback>
            </Form.Group>

            <Button variant="dark" type="submit" className="w-100 mb-3" disabled={isSubmitting}>
              {isSubmitting ? "Registering..." : "Register"}
            </Button>

            <Link to="/login" className="btn btn-outline-dark w-100">
              Already have an account? Login
            </Link>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Register;
