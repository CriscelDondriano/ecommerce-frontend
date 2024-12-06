import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Alert, Container, Card, Spinner, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faLock, faEnvelope, faUserCircle } from '@fortawesome/free-solid-svg-icons';

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('user-info')) {
            navigate("/ProductManagement");
        }
    }, [navigate]);

    const login = async () => {
        setErrorMessage("");
        setLoading(true);

        if (!email || !password) {
            setErrorMessage("Please fill in both fields.");
            setLoading(false);
            return;
        }

        let item = { email, password };

        try {
            let result = await fetch("http://127.0.0.1:8000/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(item)
            });

            if (!result.ok) {
                throw new Error('Login failed');
            }

            result = await result.json();

            if (result.error) {
                setErrorMessage("INVALID CREDENTIALS. PLEASE TRY AGAIN");
                setLoading(false);
                return;
            }

            localStorage.setItem("user-info", JSON.stringify(result));
            setLoading(false);
            navigate("/ProductManagement");

        } catch (error) {
            console.error("Login failed:", error);
            setErrorMessage("Invalid Input. Please try again.");
            setLoading(false);
        }
    };

    return (
        <Container className="d-flex flex-column justify-content-center align-items-center" style={{ height: '100vh' }}>
            <Card className="bg-light text-dark shadow-lg mx-auto" style={{ maxWidth: '600px', width: '100%', borderRadius: '15px', backgroundColor: 'rgba(255, 255, 255, 0.7)' }}>
                <FontAwesomeIcon className='mt-5' icon={faUserCircle} size='8x' />
                <h1 className='text-center pt-5 font-weight-bold'>ADMIN LOGIN</h1>
                <Card.Body className='p-5'>
                    {loading ? (
                        <div className="d-flex justify-content-center">
                            <Spinner animation="border" variant="dark" />
                        </div>
                    ) : (
                        <Form>
                            {errorMessage && (
                                <Alert variant="danger" className="mt-3">
                                    {errorMessage}
                                </Alert>
                            )}
                            <Form.Group controlId="formBasicEmail" className="mb-3">
                                <Form.Label className="font-weight-bold">Email address</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text>
                                        <FontAwesomeIcon icon={faEnvelope} />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type='email'
                                        placeholder='Enter email'
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="bg-light text-dark"
                                    />
                                </InputGroup>
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword" className="mb-3">
                                <Form.Label className="font-weight-bold">Password</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text>
                                        <FontAwesomeIcon icon={faLock} />
                                    </InputGroup.Text>

                                    <Form.Control
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder='Enter Password'
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="bg-light text-dark"
                                    />
                                    <InputGroup.Text onClick={() => setShowPassword(!showPassword)} style={{ cursor: 'pointer' }}>
                                        <FontAwesomeIcon icon={!showPassword ? faEyeSlash : faEye} />
                                    </InputGroup.Text>
                                </InputGroup>
                            </Form.Group>

                            <Button
                                variant="dark"
                                type="button"
                                onClick={login}
                                className="w-100 mt-3"
                                disabled={!email || !password}
                            >
                                Login
                            </Button>
                        </Form>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
}

export default LoginForm;
