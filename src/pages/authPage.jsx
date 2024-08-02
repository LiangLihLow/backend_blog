import { useEffect, useState } from "react";
import { Col, Image, Row, Container, Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useLocalStorage from "use-local-storage";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AuthPage() {
    const loginImage = "https://contenthub-static.grammarly.com/blog/wp-content/uploads/2017/11/how-to-write-a-blog-post.jpeg";
    const url = "https://252ade67-a896-419f-9d35-239842af9f62-00-3gudfx890km3v.spock.replit.dev";
    const [show, setShow] = useState(false);
    const [modalShow, setModalShow] = useState(null);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [authToken, setAuthToken] = useLocalStorage("authToken", "");

    const navigate = useNavigate();

    useEffect(() => {
        if (authToken) {
            navigate("/profile");
        }
    }, [authToken, navigate]);

    const handleClose = () => {
        setShow(false);
        setModalShow(null);
    };

    const handleShow = (type) => {
        setModalShow(type);
        setShow(true);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${url}/login`, { username, password });
            setAuthToken(res.data.token); // Assuming the token is in res.data.token
            toast.success('Login Successful!');
        } catch (error) {
            console.error(error);
            toast.error('Login Failed!');
        }
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${url}/signup`, { username, password });
            toast.success('Sign Up Successful!');
            handleClose();
        } catch (error) {
            console.error(error);
            toast.error('Sign Up Failed!');
        }
    };

    return (
        <Container className="vh-100 d-flex flex-column justify-content-center align-items-center">
            <ToastContainer />
            <Row className="w-100 justify-content-center">
                <Col xs={12} md={6} className="text-center mb-4">
                    <Image src={loginImage} fluid rounded />
                </Col>
                <Col xs={12} md={9} className="text-center">
                    <h1 className="mb-3" style={{ fontSize: '2rem' }}>Start Your Blog Today</h1>
                    <h2 className="mb-5" style={{ fontSize: '1.5rem' }}>Join Us</h2>
                </Col>
                <Col xs={12} md={5} className="d-flex flex-column gap-3">
                    <Button className="rounded-pill" variant="outline-dark" size="lg" onClick={() => handleShow('SignUp')}>Sign Up</Button>
                    <Button className="rounded-pill" variant="dark" size="lg" onClick={() => handleShow('Login')}>Log In</Button>
                </Col>
            </Row>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{modalShow === 'SignUp' ? 'Create your account' : 'Log In'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={modalShow === 'SignUp' ? handleSignUp : handleLogin}>
                        <Form.Group className="mb-3" controlId="formEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control onChange={(e) => setUsername(e.target.value)} type="email" placeholder="Enter email" />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                onChange={(e) => setPassword(e.target.value)}
                                type="password" placeholder="Password" />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="w-100 rounded-pill">
                            {modalShow === 'SignUp' ? 'Sign Up' : 'Log In'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
}