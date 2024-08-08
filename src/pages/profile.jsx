import React, { useState, useEffect } from "react";
import { Navbar, Container, Button, Form, FormControl, Modal, Card, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useLocalStorage from "use-local-storage";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ProfilePage() {
    const [authToken, setAuthToken] = useLocalStorage("authToken", "");
    const [posts, setPosts] = useState([]);
    const [searchId, setSearchId] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [newPost, setNewPost] = useState({ title: "", author: "", content: "" });
    const [editPost, setEditPost] = useState({ id: "", title: "", author: "", content: "" });
    const [viewAllClicked, setViewAllClicked] = useState(false);
    const [notification, setNotification] = useState("");
    const navigate = useNavigate();
    const contentURL = "https://252ade67-a896-419f-9d35-239842af9f62-00-3gudfx890km3v.spock.replit.dev";

    useEffect(() => {
        if (!authToken) {
            navigate("/");
        }
    }, [authToken, navigate]);

    const fetchPosts = async () => {
        try {
            const response = await axios.get(`${contentURL}/posts`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            setPosts(response.data.data);
        } catch (error) {
            console.error("Error fetching posts", error);
        }
    };

    const handleLogout = () => {
        setAuthToken("");
        toast.success("Logged out successfully");
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(`${contentURL}/posts/${searchId}`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            setPosts(response.data.data ? [response.data.data] : []);
            setViewAllClicked(false);
        } catch (error) {
            console.error("Error searching post", error);
            setPosts([]);
            setViewAllClicked(false);
        }
    };

    const handleViewAll = async () => {
        if (viewAllClicked) {
            setPosts([]);
            setViewAllClicked(false);
        } else {
            fetchPosts();
            setViewAllClicked(true);
        }
    };

    const handleDelete = async (postId) => {
        try {
            await axios.delete(`${contentURL}/posts/${postId}`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            setPosts(posts.filter(post => post.id !== postId));
            toast.success("Post deleted successfully");
        } catch (error) {
            console.error("Error deleting post", error);
        }
    };

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleCreatePost = async () => {
        try {
            const response = await axios.post(`${contentURL}/posts`, newPost, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            if (viewAllClicked) {
                setPosts([...posts, response.data.data]);
            }
            setNewPost({ title: "", author: "", content: "" });
            handleCloseModal();
            toast.success("Post created successfully");
        } catch (error) {
            console.error("Error creating post", error);
        }
    };

    const handleShowEditModal = (post) => {
        setEditPost(post);
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => setShowEditModal(false);

    const handleEditPost = async () => {
        try {
            await axios.put(`${contentURL}/posts/${editPost.id}`, editPost, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            setPosts(posts.map(post => (post.id === editPost.id ? editPost : post)));
            setNotification("Post updated successfully");
            handleCloseEditModal();
            toast.success("Post updated successfully");
        } catch (error) {
            console.error("Error updating post", error);
        }
    };

    return (
        <>
            <ToastContainer />
            <Navbar bg="dark" variant="dark" expand="lg">
                <Container>
                    <Navbar.Brand>Profile</Navbar.Brand>
                    <Button onClick={handleLogout} variant="outline-light">Logout</Button>
                </Container>
            </Navbar>

            <Container className="mt-5">
                <h2>Welcome to Your Profile</h2>
                <Button onClick={handleShowModal} className="my-3">Create New Post</Button>
                {notification && <Alert variant="success">{notification}</Alert>}
                <Form onSubmit={handleSearch} className="d-flex mb-3">
                    <FormControl
                        type="text"
                        placeholder="Search by Post ID"
                        className="me-2"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                    />
                    <Button type="submit" variant="outline-success">Search</Button>
                </Form>
                <Button onClick={handleViewAll} className="mb-3">
                    {viewAllClicked ? "Hide All Posts" : "View All Posts"}
                </Button>

                {posts.length === 0 ? (
                    <Alert variant="info">No posts available.</Alert>
                ) : (
                    posts.map(post => (
                        <Card key={post.id} className="mb-3">
                            <Card.Header className="d-flex justify-content-between align-items-center">
                                <span>ID: {post.id}</span>
                                <div>
                                    <Button variant="primary" onClick={() => handleShowEditModal(post)} className="me-2">Edit</Button>
                                    <Button variant="danger" onClick={() => handleDelete(post.id)}>Delete</Button>
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <Card.Title>{post.title}</Card.Title>
                                <Card.Text>{post.content}</Card.Text>
                                <Card.Subtitle className="mb-2 text-muted">By {post.author}</Card.Subtitle>
                            </Card.Body>
                        </Card>
                    ))
                )}
            </Container>

            {/* Create Post Modal */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Create New Post</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter post title"
                                value={newPost.title}
                                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Author</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter author name"
                                value={newPost.author}
                                onChange={(e) => setNewPost({ ...newPost, author: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Content</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter post content"
                                value={newPost.content}
                                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
                    <Button variant="primary" onClick={handleCreatePost}>Create Post</Button>
                </Modal.Footer>
            </Modal>

            {/* Edit Post Modal */}
            <Modal show={showEditModal} onHide={handleCloseEditModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Post</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter post title"
                                value={editPost.title}
                                onChange={(e) => setEditPost({ ...editPost, title: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Author</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter author name"
                                value={editPost.author}
                                onChange={(e) => setEditPost({ ...editPost, author: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Content</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter post content"
                                value={editPost.content}
                                onChange={(e) => setEditPost({ ...editPost, content: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseEditModal}>Close</Button>
                    <Button variant="primary" onClick={handleEditPost}>Save Changes</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
